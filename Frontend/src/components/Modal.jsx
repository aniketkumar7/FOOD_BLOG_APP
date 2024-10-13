import { PropTypes } from "prop-types";

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

