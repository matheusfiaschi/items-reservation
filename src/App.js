import React, { useState, useEffect } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PacmanLoader } from "react-spinners";
import coracaoImage from "./img/list.svg";

function App() {
  const [showModal, setShowModal] = useState(false);
  const [selectedItemKey, setSelectedItemKey] = useState(null); // Alterado para selectedItemKey
  const [updatedData, setUpdatedData] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const openModal = (key) => {
    // Modificado para receber a chave
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
    const response = await fetch(
      `https://edge-config.vercel.com/ecfg_rwi3tgaetdpr4csjh6gzbj5fkhan/items`,
      {
        headers: {
          Authorization: `Bearer 941d091a-b295-4605-a6b1-4336ae5049e3`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Erro na solicitação!");
    }
    return response.json();
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

    console.log("items", items);

    let reservationItem = {};
    let isReservedItem = false;
    const updatedJsonData = Object.keys(items).map((key) => {
      if (key === selectedItemKey && items[key].active) {
        reservationItem = {
          ...items[key],
          active: false,
          reservationName: name,
        };
        return { ...items[key], active: false };
      } else if (key === selectedItemKey && !items[key].active) {
        isReservedItem = true;
      }

      return items[key];
    });

    await Promise.all(updatedJsonData);

    if (isReservedItem) {
      closeModal();
      setLoading(false);
      toast.error(
        "Desculpe, infelizmente esse item já foi reservado por outra pessoa, por favor escolha outra opção!",
        {
          autoClose: 10000,
        }
      );
      return;
    }

    setUpdatedData(updatedJsonData);

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
                key: `${reservationItem.key}`,
                value: reservationItem,
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
    toast.success("Reserva confirmada com sucesso!");

    const myList = JSON.parse(localStorage.getItem("myList")) || {};
    myList[reservationItem.key] = reservationItem;
    localStorage.setItem("myList", JSON.stringify(myList));
  };

  const myListPage = async () => {
    window.location.href = "http://localhost:3000/myList";
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
        {/* <div>
          <img
            className="coracao"
            src={
              "https://images.vexels.com/media/users/3/324725/isolated/preview/c69cbd4788f85c9bc18888c06a502675-a-cone-de-coraa-a-o-rosa.png"
            }
          />
        </div> */}
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
        {Object.keys(updatedData).some((key) => updatedData[key].active) ? (
          Object.keys(updatedData).map((key) =>
            updatedData[key].active ? (
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
                  {" "}
                  {/* Modificado para passar a chave */}
                  Reservar
                </div>
              </div>
            ) : null
          )
        ) : (
          <p>Não há mais itens disponíveis na lista.</p>
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
