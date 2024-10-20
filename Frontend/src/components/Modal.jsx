import { PropTypes } from "prop-types";

// Modal component
// This component renders a modal dialog box
// It takes two props:
//   onClose: a function to close the modal
//   children: the content of the modal
export default function Modal({children, onClose}) {
  return (
    <>
        <div className='backdrop' onClick={onClose}></div>
            <dialog className='modal' open>
                {children}
            </dialog>

    </>
  )
}

// props validation
Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

