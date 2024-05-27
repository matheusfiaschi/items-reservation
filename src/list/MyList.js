import React, { useState, useEffect } from "react";
import "./list.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PacmanLoader } from "react-spinners";
import backImage from "../img/back.svg";

function MyList() {
  const [showModal, setShowModal] = useState(false);
  const [selectedItemKey, setSelectedItemKey] = useState(null);
  const [updatedData, setUpdatedData] = useState(
    JSON.parse(localStorage.getItem("myList"))
  );
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  console.log(JSON.parse(localStorage.getItem("myList")));

  const openModal = (key) => {
    // Modificado para receber a chave
    setSelectedItemKey(key);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const myListPage = async () => {
    window.location.href = "http://localhost:3000/";
  };

  const cancelReserve = async () => {
    const cancelationItem = { ...updatedData[selectedItemKey], active: true };

    setLoading(true);

    try {
      const updateEdgeConfig = await fetch(
        `https://api.vercel.com/v1/edge-config/ecfg_rwi3tgaetdpr4csjh6gzbj5fkhan/items`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer 3bxyfFFGfjfdZQOJSY5gWsWV`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: [
              {
                operation: "update",
                key: selectedItemKey,
                value: cancelationItem,
              },
            ],
          }),
        }
      );
      const result = await updateEdgeConfig.json();
      console.log(result);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
    toast.success("Reserva cancelada com sucesso!");

    const myList = JSON.parse(localStorage.getItem("myList")) || {};
    delete myList[selectedItemKey];
    localStorage.setItem("myList", JSON.stringify(myList));
    setUpdatedData(myList);
    closeModal();
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
        {/* <div className="container-name" onClick={myListPage}>
          <div style={{ height: "20px" }}>
            <p style={{ marginRight: "5px" }}>
              PEDRO <b className="e">e</b>
            </p>
          </div>
          <div>
            <p>GABI</p>
          </div>
        </div> */}
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
      {/* <div onClick={myListPage} style={{ display: "flex" }}>
        Lista de presentes
      </div> */}
      <div className="product-list">
        {Object.keys(updatedData).length ? (
          Object.keys(updatedData).map(
            (
              key // Removido Object.keys(updatedData).some(...)
            ) => (
              <div className="product-card" key={key}>
                <h2>{updatedData[key].name}</h2>
                <div
                  className="container-img"
                  style={{
                    background: `url(${updatedData[key].image})`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }}
                ></div>
                <p style={{ userSelect: "none" }}>
                  {updatedData[key].description}
                </p>
                <div
                  onClick={() => openModal(updatedData[key].key)}
                  className="reservar"
                >
                  Cancelar Reserva
                </div>
              </div>
            )
          )
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
              Ao cancelar a reseva, você estará devolvendo esse item para lista
              de presentes, e dando a possibilidade de outra pessoa reservar
              esse item, deseja cancelar mesmo assim ?
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
