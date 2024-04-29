import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import jsonData from "./dataBase.json"; // Importe seu JSON aqui
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [showModal, setShowModal] = useState(false); // Estado para controlar se o modal está aberto
  const [selectedItemIndex, setSelectedItemIndex] = useState(null); // Estado para armazenar o índice do item selecionado
  const [updatedData, setUpdatedData] = useState(jsonData); // Estado para armazenar os dados atualizados

  const openModal = (index) => {
    setSelectedItemIndex(index); // Define o índice do item selecionado
    setShowModal(true); // Função para abrir o modal
  };

  const closeModal = () => {
    setShowModal(false); // Função para fechar o modal
  };

  const handleReserve = async () => {
    const updatedJsonData = updatedData.map((item, index) => {
      if (index === selectedItemIndex && item.active) {
        return { ...item, active: false };
      }
      return item;
    });

    await Promise.all(updatedJsonData);
 
    setUpdatedData(updatedJsonData);

    try {
      const response = await fetch("http://localhost:3001/api/updateJson", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updatedJsonData }),
      });
      if (response.ok) {
        console.log("Item atualizado com sucesso!");
      } else {
        console.error("Erro ao atualizar item - BACK:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao atualizar item - FRONT:", error);
    }

    console.log("Reserva confirmada!");
    closeModal();
    toast.success("Reserva confirmada com sucesso!");
  };

  useEffect(() => {
 
  }, [updatedData]);

  return (
    <div className="App">
      <ToastContainer />
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
        {updatedData.map((product, index) =>
          product.active ? (
            <div className="product-card" key={index}>
              <h2>{product.name}</h2>
              <div
                className="container-img"
                style={{
                  background: `url(${product.image})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              ></div>
              <p style={{ userSelect: "none" }}>{product.description}</p>
              <p>{product.obs}</p>
              <div onClick={() => openModal(index)} className="reservar">
                Reservar
              </div>
            </div>
          ) : null
        )}
      </div>
      {showModal && ( // Renderiza o modal apenas se showModal for verdadeiro
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
