import React, { useState, useEffect } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PacmanLoader } from "react-spinners";

function App() {
  const [showModal, setShowModal] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [updatedData, setUpdatedData] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const openModal = (index) => {
    setSelectedItemIndex(index);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = () => {
    fetch(
      `https://edge-config.vercel.com/ecfg_rwi3tgaetdpr4csjh6gzbj5fkhan/items`,
      {
        headers: {
          Authorization: `Bearer 941d091a-b295-4605-a6b1-4336ae5049e3`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro na solicitação!");
        }
        return response.json(); // Isso converte a resposta para JSON
      })
      .then((data) => {
        setUpdatedData(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Erro:", error);
      });
  };

  const handleReserve = async () => {
    if (!name) {
      toast.error("Por favor, insira seu nome.");
      return;
    }

    closeModal();

    setLoading(true);

    let reservationItem = {};
    const updatedJsonData = Object.keys(updatedData).map((key) => {
      if (key === selectedItemIndex && updatedData[key].active) {
        reservationItem = {
          ...updatedData[key],
          active: false,
          reservationName: name,
        };
        return { ...updatedData[key], active: false };
      }
      return updatedData[key];
    });

    await Promise.all(updatedJsonData);

    setUpdatedData(updatedJsonData);

    console.log(reservationItem);
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
  };

  return (
    <div className="App">
      <ToastContainer />
      {loading && (
        <div className="spinner-overlay">
          <PacmanLoader
            color={"#36D7B7"}
            loading={loading}
            size={25}
          />
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
        <div>
          <img
            className="coracao"
            src={
              "https://images.vexels.com/media/users/3/324725/isolated/preview/c69cbd4788f85c9bc18888c06a502675-a-cone-de-coraa-a-o-rosa.png"
            }
          />
        </div>
      </header>
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
                <div onClick={() => openModal(key)} className="reservar">
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
          <div className="modal-content">
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
