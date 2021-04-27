import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

const RoomiesModal = (props) => {
  const { buttonLabel, className } = props;

  const [modal, setModal] = useState(false);

  //Toggle modal isOpen from true to false using useState
  const toggle = () => setModal(!modal);

  //Function that maps through roomies in the chat and list them each on a new line
  const showRoomies = () => {
    return props.roomies.map((item, index) => {
      return <ListGroupItem key={index}>{item}</ListGroupItem>;
    });
  };

  return (
    <div>
      <Button color="danger" onClick={toggle}>
        {" "}
        Homies en el Chat{buttonLabel}
      </Button>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>Roomies in Chat</ModalHeader>
        <ModalBody>
          {/* Calls showRoomies to list all roomies */}
          <ListGroup>{showRoomies()}</ListGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default RoomiesModal;
