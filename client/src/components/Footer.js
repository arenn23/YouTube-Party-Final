import React from "react";

function Footer() {
  return (
    <>
      <div className="site-footer">
        <div className="container">
          <div className="row">
            <div className="col"></div>
            <div className="col-6 col-sm-5 text-center">
              <a
                className="btn btn-social-icon btn-instagram"
                href="http://instagram.com/"
              >
                <i className="fa fa-instagram"></i>
              </a>
              <a
                className="btn btn-social-icon btn-facebook"
                href="http://facebook.com/"
              >
                <i className="fa fa-facebook"></i>
              </a>
              <a
                className="btn btn-social-icon btn-twitter"
                href="http://twitter.com/"
              >
                <i className="fa fa-twitter"></i>
              </a>
            </div>
            <div className="col"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
