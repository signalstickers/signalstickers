import { Modal } from 'bootstrap';
// import cx from 'classnames';
import React from 'react';
import { BsExclamationTriangle } from 'react-icons/bs';
import { useHistory } from 'react-router-dom';

import ExternalLink from 'components/general/ExternalLink';

import classes from './ContentWarningModal.css';


export default function ContentWarningModal() {
  const modalRef = React.createRef<HTMLDivElement>();
  const modalDialogRef = React.createRef<HTMLDivElement>();
  const history = useHistory();

  /**
   * Show the modal when the component is rendered for the first time.
   */
  React.useEffect(() => {
    if (!modalRef.current) return;
    if (!modalDialogRef.current) return;

    const bsModal = Modal.getOrCreateInstance(modalRef.current, {
      backdrop: false,
      keyboard: false
    });

    modalRef.current.classList.add(classes.blurredBackdrop);

    // Add the "fade" class _after_ the modal is shown to apply an animation
    // effect when it is dismissed. We want this particular modal to appear
    // immediately, so we don't want this effect applied by default.
    modalRef.current.classList.add('fade');

    // Only apply these on the "sm" breakpoint and up.
    if (window.innerWidth >= 576) {
      // Set the modal element's top offset to the height of the navbar, then
      // apply the inverse offset to the dialog.
      const navHeight = document.querySelectorAll('nav')[0]?.getBoundingClientRect().height;
      modalRef.current.style.top = String(`${navHeight}px`);
      modalDialogRef.current.style.top = `-${navHeight}px`;
    }

    bsModal.show();

    return () => bsModal.hide();
  }, [window.innerWidth]);


  return (
    <div
      id="nsfw-modal"
      className="modal"
      ref={modalRef}
      role="dialog"
      tabIndex={-1}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down"
        ref={modalDialogRef}
        role="document"
      >
        <div className="modal-content safe-area-padding">
          <div className="modal-header">
            <h3 className="modal-title">
              <BsExclamationTriangle className="ms-1 me-2 text-warning fs-3" /> Content Warning
            </h3>
          </div>
          <div className="modal-body fs-5">
            <p>
              This pack has been marked <i>Not Safe For Work</i> (<ExternalLink href="https://www.urbandictionary.com/define.php?term=NSFW">NSFW</ExternalLink>).
              This means that it may contain nudity, sexual content, or other potentially disturbing subject matter.
            </p>
            <p>You should not view this pack at work, or with children around.</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              role="link"
              className="btn btn-secondary btn-lg"
              title="Back"
              onClick={() => history.goBack()}
            >
              Back
            </button>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              data-bs-dismiss="modal"
              title="Continue"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
