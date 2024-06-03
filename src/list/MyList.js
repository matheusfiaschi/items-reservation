import React, { useState, useEffect } from "react";
import "./list.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PacmanLoader } from "react-spinners";
import backImage from "../img/back.svg";

function MyList() {
  const [showModal, setShowModal] = useState(false);
  const [selectedItemKey, setSelectedItemKey] = useState(null);
  const [updatedData, setUpdatedData] = useState([]);
  const [loading, setLoading] = useState(false);

  const openModal = (key) => {
    setSelectedItemKey(key);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadMyList();
        setUpdatedData(data);
        console.log(data);
      } catch (error) {
        console.error("Erro:", error);
      }
    };

    fetchData();
  }, []);

  const loadMyList = async () => {
    try {
      const myList = JSON.parse(localStorage.getItem("myList")) || {};
      return Object.values(myList); // Retorna apenas os valores do objeto como um array
    } catch (error) {
      console.error("Erro ao carregar lista de reservas:", error);
      return [];
    }
  };

  const myListPage = () => {
    window.location.href = "https://items-reservation.vercel.app/";
  };

  const openSuggestionSite = async (url) => {
    console.log(url);
    window.open(url, "_blank");
  };

  const cancelReserve = async () => {
    setLoading(true);

    let cancelationItem;

    try {
      const updatedList = updatedData.map((item) => {
        if (item._id === selectedItemKey) {
          cancelationItem = { ...item, active: true }; // Cria o objeto cancelationItem com status active true
          return cancelationItem; // Retorna o cancelationItem modificado
        }
        return item;
      });

      fetch(
        `https://items-reservation-back.vercel.app/items/${cancelationItem._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cancelationItem),
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update item");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Item updated successfully:", data);
        })
        .catch((error) => {
          console.error("Error updating item:", error);
        });

      const myList = JSON.parse(localStorage.getItem("myList")) || {};
      delete myList[cancelationItem._id];
      localStorage.setItem("myList", JSON.stringify(myList));

      setUpdatedData(Object.values(myList));
      closeModal();
      setLoading(false);
      toast.success("Reserva cancelada com sucesso!");
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error);
      setLoading(false);
      toast.error("Erro ao cancelar reserva. Tente novamente mais tarde.");
    }
  };

  return (
    <div className="App">
      <ToastContainer />
      {loading && (
        <div className="spinner-overlay">
          <PacmanLoader color={"#36D7B7"} loading={loading} size={25} />
        </div>
      )}
      <header className="App-header">
        <img
          onClick={myListPage}
          style={{ marginLeft: "5px" }}
          className="list"
          src={backImage}
        />
        <div className="cha" onClick={myListPage}>
          CHÁ DE CASA NOVA
        </div>
        <div>
          <img
            className="coracao"
            src={
              "https://images.vexels.com/media/users/3/324725/isolated/preview/c69cbd4788f85c9bc18888c06a502675-a-cone-de-coraa-a-o-rosa.png"
            }
          />
        </div>
      </header>
      <div className="lista-presentes">MINHAS RESERVAS</div>
      <div className="product-list">
        {updatedData.length ? (
          updatedData.map((item) => (
            <div className="product-card" key={item._id}>
              <h2>{item.name}</h2>
              <div
                className="container-img"
                style={{
                  background: `url(${item.image})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              ></div>
              <p style={{ userSelect: "none" }}>{item.description}</p>
              <a
                hidden={!item.link}
                className="suggestionText"
                style={{ userSelect: "none" }}
                onClick={() => openSuggestionSite(item.link)}
              >
                Sugestão lugar de compra
              </a>
              <div onClick={() => openModal(item._id)} className="reservar">
                Cancelar Reserva
              </div>
            </div>
          ))
        ) : (
          <p>Não há itens na sua lista de reserva.</p>
        )}
      </div>

      {showModal && (
        <div className="modal">
          <div
            className={`modal-content ${
              showModal ? "modal-open" : "modal-close"
            }`}
          >
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>Cancelar Reserva</h2>
            <p>
              Ao cancelar a reserva, você estará devolvendo esse item para a
              lista de presentes, dando a possibilidade de outra pessoa reservar
              esse item. Deseja cancelar mesmo assim?
            </p>
            <div className="modal-buttons">
              <button className="confirmar" onClick={cancelReserve}>
                Sim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { MyList };
