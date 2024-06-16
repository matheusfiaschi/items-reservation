import React, { useState, useEffect } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PacmanLoader } from "react-spinners";
import coracaoImage from "./img/list.svg";

function App() {
  const [showModal, setShowModal] = useState(false);
  const [selectedItemKey, setSelectedItemKey] = useState(null);
  const [updatedData, setUpdatedData] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);

  const openModal = async (key) => {
    setSelectedItemKey(key);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadItems();
        setUpdatedData(data);
        console.log(data);
      } catch (error) {
        console.error("Erro:", error);
      }
    };

    fetchData();
  }, []);

  const loadItems = async () => {
    try {
      setLoadingItems(true);
      const response = await fetch(
        "https://items-reservation-back.vercel.app/items"
      );
      if (!response.ok) {
        throw new Error("Erro ao obter dados");
      }
      const data = await response.json();
      console.log("Dados recebidos:", data);
      setLoadingItems(false);
      return data;
    } catch (error) {
      setLoadingItems(false);
      console.error("Erro:", error);
    }
  };

  const handleReserve = async () => {
    if (!name) {
      toast.warning("Por favor, insira seu nome.");
      return;
    }

    closeModal();
    setLoading(true);

    const items = await loadItems();
    setUpdatedData(items);
    const reservationItem = items.find((item) => item._id === selectedItemKey);

    if (!reservationItem || !reservationItem.active) {
      setLoading(false);
      toast.error(
        "Desculpe, infelizmente esse item já foi reservado por outra pessoa, por favor escolha outra opção!",
        {
          autoClose: 10000,
        }
      );
      return;
    }

    reservationItem.active = false;
    reservationItem.reservationName = name;

    console.log(reservationItem);

    fetch(
      `https://items-reservation-back.vercel.app/items/${reservationItem._id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationItem),
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

    setUpdatedData((prevData) => {
      const newData = prevData.map((item) => {
        if (item._id === reservationItem._id) {
          return reservationItem;
        }
        return item;
      });
      return newData;
    });

    setLoading(false);
    toast.success("Reserva confirmada com sucesso!");

    const myList = JSON.parse(localStorage.getItem("myList")) || {};
    myList[reservationItem._id] = reservationItem;
    localStorage.setItem("myList", JSON.stringify(myList));
  };

  const myListPage = async () => {
    window.location.href = "https://items-reservation.vercel.app/myList";
  };

  const openSuggestionSite = async (url) => {
    console.log(url);
    window.open(url, "_blank");
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
        <div className="container-name">
          <div style={{ height: "20px" }}>
            <p style={{ marginRight: "5px" }}>
              PEDRO <b className="e">e</b>
            </p>
          </div>
          <div>
            <p>GABI</p>
          </div>
        </div>
        <div className="cha">CHÁ DE CASA NOVA</div>
        <div onClick={myListPage} style={{ display: "flex" }}>
          <div
            hidden={
              !localStorage?.myList ||
              !Object.keys(JSON.parse(localStorage.getItem("myList")))?.length
            }
            className="quantityList"
          >
            {localStorage.myList
              ? Object.keys(JSON.parse(localStorage.getItem("myList")))?.length
              : 0}
          </div>
          <img className="list" src={coracaoImage} />
        </div>
      </header>
      <div className="container-introduction">
        <div className="img-gabiAndPredro"></div>
        <div className="divider"></div>
        <div className="text-introduction">
          <p>Olá, família e amigos!</p>
          <p>
            É com muito carinho que convidamos vocês para o nosso Chá de Casa
            Nova!
          </p>
          <p>
            Neste site estarão algumas sugestões de presentes para o nosso apê,
            basta você clicar em um item que tenha interesse em nos presentear,
            colocar o seu nome e pronto.
          </p>
          <p>
            Os itens reservados ficarão na sua lista. Você pode acessá-la
            clicando no ícone de lista no cabeçalho, no topo da página.
          </p>
          <p>
            Após escolher o item, ele não ficará mais disponível para escolha,
            evitando assim que tenha algo repetido. Além da foto do presente,
            terá também um link onde é possível ver o produto diretamente no
            site de vendas (Amazon, Mercado Livre, etc.)
          </p>
          <p>
            O site não é vinculado a nenhuma loja, a ideia é que você leve esse
            presente no dia do chá, para que possamos fazer algumas brincadeiras
            e principalmente que seja uma surpresa para todos.
          </p>
          <p>Aguardamos a sua presença!</p>
        </div>
      </div>
      <div className="divider-page"></div>
      <div className="lista-presentes">LISTA DE PRESENTES</div>
      <div className="product-list">
        {updatedData.length ? (
          <>
            {updatedData.some((item) => item.active) ? (
              updatedData.map(
                (item) =>
                  item.active && (
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
                      <div
                        onClick={() => openModal(item._id)}
                        className="reservar"
                      >
                        Reservar
                      </div>
                    </div>
                  )
              )
            ) : (
              <p>Não há mais itens disponíveis na lista.</p>
            )}
          </>
        ) : (
          <>
            <PacmanLoader color={"#36D7B7"} loading={loadingItems} size={25} />
            <p hidden={loadingItems}>Não há mais itens disponíveis na lista.</p>
          </>
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
            <h2>Confirmar Reserva</h2>
            <p>
              Ao cofirmar, você vai estar assumindo a reserva, tirando a
              possibilidade de outra pessoa reservar este item, deseja
              continuar?
            </p>
            <input
              className="input-name"
              type="text"
              placeholder="Seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="modal-buttons">
              <button className="cancelar" onClick={handleReserve}>
                Confirmar
              </button>
              <button className="confirmar" onClick={closeModal}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
