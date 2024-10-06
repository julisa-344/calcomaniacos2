import React from "react";
import PropTypes from "prop-types";
import Button from "../components/Button";

const ModalComponent = ({ img, onClose, title, content }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="start-content">
          <img src={img} alt="Modal" />
        </div>
        <div className="modal-content_text">
          <h2 className="title primary-color">{title}</h2>
          <br />
          <p className="color-grey">{content}</p>
        </div>
        <Button text="Cerrar" onClick={onClose} />
      </div>
    </div>
  );
};

ModalComponent.propTypes = {
  img: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default ModalComponent;
