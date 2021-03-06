import React from "react";
import PropTypes from "prop-types";
import hoistStatics from "hoist-non-react-statics";
import invariant from "tiny-invariant";

import RouterContext from "./RouterContext.js";

// React 15 compat
let { forwardRef } = React;
const forwardRefShim = C => C;
if (typeof forwardRef === "undefined") {
  forwardRef = forwardRefShim;
}

/**
 * A public higher-order component to access the imperative API
 */
function withRouter(Component) {
  const displayName = `withRouter(${Component.displayName || Component.name})`;
  const C = forwardRef((props, forwardedRef) => {
    const { wrappedComponentRef, ...remainingProps } = props;

    // React 15 compat
    let ref = wrappedComponentRef;
    if (forwardRefShim !== forwardRef && forwardedRef) {
      ref = forwardedRef;
    }

    return (
      <RouterContext.Consumer>
        {context => {
          invariant(
            context,
            `You should not use <${displayName} /> outside a <Router>`
          );
          return <Component {...remainingProps} {...context} ref={ref} />;
        }}
      </RouterContext.Consumer>
    );
  });

  C.displayName = displayName;
  C.WrappedComponent = Component;

  if (__DEV__) {
    C.propTypes = {
      wrappedComponentRef: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
        PropTypes.object
      ])
    };
  }

  return hoistStatics(C, Component);
}

export default withRouter;
