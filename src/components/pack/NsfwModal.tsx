import cx from 'classnames';
import React from 'react';
import {BsExclamationTriangle} from 'react-icons/bs';
import {Link} from 'react-router-dom';

import ExternalLink from 'components/general/ExternalLink';

import classes from './NsfwModal.css';


export default function NsfwModal() {
  /**
   * Show the modal when the component is rendered for the first time.
   */
  React.useEffect(() => {
    // @ts-expect-error
    $('#nsfw-modal').modal({
      show: true,
      // These two settings ensure the modal cannot be dismissed by clicking the
      // backdrop.
      keyboard: false,
      backdrop: 'static'
    });

    // By not adding this class to the markup, we ensure the modal (and our
    // custom backdrop) appear immediately when the component renders. By adding
    // it here, however, we ensure a smooth fade-out animation when the modal is
    // closed.
    $('#nsfw-modal').addClass('fade');

    // We don't use Bootstrap's top-level backdrop, so hide it.
    $('.modal-backdrop').css('display', 'none');
  }, []);


  /**
   * Hides the modal when the 'Show pack' button is clicked.
   */
  const onHideNsfwModalClick = React.useCallback(() => {
    // @ts-expect-error
    $('#nsfw-modal').modal('hide');
  }, []);


  return (
    <div
      id="nsfw-modal"
      className={cx(classes.nsfwModal, 'modal')}
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">
              <BsExclamationTriangle className="mr-1 text-primary" /> Content Warning
            </h3>
          </div>
          <div className="modal-body">
            <p>
              This pack has been marked <i>Not Safe For Work</i> (<ExternalLink href="https://www.urbandictionary.com/define.php?term=NSFW">NSFW</ExternalLink>).
              <br />
              This means that it may contain nudity, sexual content, or other potentially disturbing subject matter.
            </p>
            <p>You should not view this pack at work, or with children around.</p>
          </div>
          <div className="modal-footer">
            <Link
              to="/"
              className="btn btn-light"
              title="Go back home"
            >
              Go back home
            </Link>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onHideNsfwModalClick}
            >
              Show the pack
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
