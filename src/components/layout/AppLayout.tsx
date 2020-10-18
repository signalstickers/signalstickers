import {css} from 'linaria';
import {styled} from 'linaria/react';
import pThrottle from 'p-throttle';
import {rgba} from 'polished';
import React, {Suspense} from 'react';
import {Switch, Route} from 'react-router-dom';
import {useScrollPercentage} from 'react-scroll-percentage';
import useAsyncEffect from 'use-async-effect';

import Navbar from 'components/layout/Navbar';
import SuspenseFallback from 'components/layout/SuspenseFallback';
import AppStateContext from 'contexts/AppStateContext';
import {
  GRAY_DARKER_2,
  GRAY_LIGHTER,
  GRAY_DARKER,
  PRIMARY_DARKER,
  PRIMARY_LIGHTER,
  DARK_THEME_BACKGROUND
} from 'etc/colors';


// Note: Each top-level route should be imported az a lazy-loaded component.
const Home = React.lazy(async () => import(
  /* webpackChunkName: "home" */
  'components/home/Home'
));

const Pack = React.lazy(async () => import(
  /* webpackChunkName: "detail" */
  'components/pack/StickerPackDetail'
));

const Contribute = React.lazy(async () => import(
  /* webpackChunkName: "contribute" */
  'components/contribute/Contribute'
));

const About = React.lazy(async () => import(
  /* webpackChunkName: "about" */
  'components/about/About'
));


// ----- Styles ----------------------------------------------------------------

/**
 * Global styles that we need to define using JavaScript. Exported to appease
 * the linter.
 */
export const globals = css`
  :global() {
    & .theme-light {
      & .form-control {
        &:not(.is-invalid) {
          border-color: rgba(0, 0, 0, 0.125);

          &:focus {
            box-shadow: 0 0 0 0.15rem ${rgba(GRAY_LIGHTER, 0.25)};
          }
        }
      }
    }

    & .theme-dark {
      & .btn-light {
        background-color: var(--gray-dark);
        border-color: ${GRAY_DARKER};
        color: var(--light);

        &:hover {
          background-color: ${GRAY_DARKER_2};
          color: var(--light);
        }

        &:active:focus {
          background-color: ${GRAY_DARKER_2};
          color: var(--light);
        }
      }

      & .btn-primary,
      & .btn-success {
        color: var(--light);

        &:hover {
          color: var(--light);
        }
      }

      & .btn-secondary {
        background-color: var(--secondary);
      }

      & .card {
        background-color: ${GRAY_DARKER_2};
        border-color: ${GRAY_DARKER};
        box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.15);
      }

      & .form-control {
        background-color: ${GRAY_DARKER_2};
        color: inherit;

        &:not(.is-invalid) {
          border-color: ${GRAY_DARKER};

          &:focus {
            border-color: ${GRAY_LIGHTER};
            box-shadow: 0 0 0 0.15rem ${rgba(GRAY_LIGHTER, 0.25)};
          }
        }
      }

      & .modal-header,
      & .modal-footer {
        border-color: ${GRAY_DARKER};
      }

      /* !important is needed here because Bootstrap uses it as well. */
      & .text-dark {
        color: var(--light) !important;
      }

      & .text-muted {
        color: ${GRAY_LIGHTER} !important;
      }

      & a,
      & .btn.btn-link {
        color: var(--primary);

        &:hover {
          color: ${PRIMARY_LIGHTER};
        }
      }

      & hr {
        border-color: ${GRAY_DARKER};
      }

      & pre {
        color: var(--light);
      }
    }
  }
`;


const StyledContainer = styled.div`
  display: flex;
  flex-grow: 1;

  .theme-light & {
    background-color: var(--white);
    color: var(--dark);
  }

  .theme-dark & {
    background-color: ${DARK_THEME_BACKGROUND};
    color: var(--light);
  }
`;


// ----- Component -------------------------------------------------------------

const AppLayout: React.FunctionComponent = () => {
  const useAppState = React.useContext(AppStateContext);
  const [darkMode] = useAppState<boolean>('darkMode');
  const [ref, percentage] = useScrollPercentage();


  /**
   * [Effect]
   *
   * Apply classes to <body> to indicate the current theme. We do this here
   * (even though we are a child of <body>) because this is the highest level
   * React component in our tree that renders actual HTML.
   */
  React.useEffect(() => {
    const bodyEl = document.querySelector('body');

    if (!bodyEl) {
      return;
    }

    if (darkMode) {
      bodyEl.classList.add('theme-dark');
      bodyEl.classList.remove('theme-light');
    } else {
      bodyEl.classList.add('theme-light');
      bodyEl.classList.remove('theme-dark');
    }
  }, [darkMode]);


  /**
   * [Effect]
   *
   * Ensures that the background color shown during over-scroll matches adjacent
   * content. Unfortunately the only way this can be reliably done at the moment
   * is by changing the body's background color. To minimize performance impact,
   * we run this function asynchronously and throttle calls to a maximum of 10
   * times per second.
   */
  useAsyncEffect(pThrottle(() => {
    const bodyEl = document.querySelector('body');

    if (!bodyEl) {
      return;
    }

    if (darkMode) {
      bodyEl.style.backgroundColor = percentage < 0.5 ? PRIMARY_DARKER : 'var(--dark)';
    } else {
      bodyEl.style.backgroundColor = percentage < 0.5 ? 'var(--primary)' : 'var(--white)';
    }
  }, 10, 1000), [percentage, darkMode]);


  return (<>
    <Navbar />
    <StyledContainer ref={ref}>
      <div className="container d-flex flex-column flex-grow-1">
        <Suspense fallback={<SuspenseFallback />}>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/pack/:packId">
              <Pack />
            </Route>
            <Route path="/contribute">
              <Contribute />
            </Route>
            <Route path="/about">
              <About />
            </Route>
          </Switch>
        </Suspense>
      </div>
    </StyledContainer>
  </>);
};


export default AppLayout;
