import {styled} from 'linaria/react';
import {Link} from 'react-router-dom';
import React, {useState} from 'react';

// ----- Styles ----------------------------------------------------------------

const NsfwModal = styled.div`
  & .modal{
      // Overrides the default display:none
      display: block;
  }

  & .nsfw-hide{
      height: 100%;
      width: 100%;
      background-color: white;
      position: absolute;
      top: 70px;
      left: 0;
      z-index: 200;
  }
`;

// ----- Component -------------------------------------------------------------

const NsfwModalComponent: React.FunctionComponent = () => {
    const [hiddenNsfwModal, setHiddenNsfwModal] = useState(false);

    /**
     * Sets 'hiddenNsfwModal' when the 'Show pack' button is clicked.
     */
    const onHideNsfwModalClick = () => {
        setHiddenNsfwModal(true);
    };

  // ----- Render --------------------------------------------------------------

  return (
    <NsfwModal>
        {hiddenNsfwModal ? null :
        <div className="nsfw-hide">
            <div className="modal">
                <div className="modal-dialog  modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">Content warning</h3>
                        </div>
                        <div className="modal-body">
                            <p>
                                This pack has been marked <i>Not Safe For Work</i> (<a href="https://www.urbandictionary.com/define.php?term=NSFW" target="_blank" rel="noreferrer">NSFW</a>).
                                <br/>
                                This means that it may contain nudity, sexual content, or other potentially disturbing subject matter.
                            </p>
                            <p>You should not see this pack at work, or with children around.</p>
                        </div>
                        <div className="modal-footer">
                            <Link to="/" className="btn btn-secondary" title="Go back home">
                                Go back home
                            </Link>
                            <button className="btn btn-primary" onClick={onHideNsfwModalClick}>
                            Show the pack
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        }
    </NsfwModal>
  );
};


export default NsfwModalComponent;
