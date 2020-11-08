import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, ListGroup, ListGroupItem  } from 'reactstrap';


const RoomiesModal = (props) => {
  const {
    buttonLabel,
    className
  } = props;

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const showRoomies = () => {
      return props.roomies.map((item, index) => {
          return (
              <ListGroupItem key={index}>
                  {item}
              </ListGroupItem>
          )
      })
  }

  return (
    <div>
      <Button color="danger" onClick={toggle}> Homies en el Chat{buttonLabel}</Button>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>Roomies in Chat</ModalHeader>
        <ModalBody>
            <ListGroup>
              {showRoomies()}
            </ListGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>Close</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default RoomiesModal;