import React, {useState} from 'react'

const CopyLinkIcon = () => {

    const [stroke, setStroke] = useState('white');

  return (
    <svg
  xmlns="http://www.w3.org/2000/svg"
  xmlnsXlink="http://www.w3.org/1999/xlink"
  width="32px"
  height="32px"
  viewBox="0 0 28 28"
  version="1.1"
  id="copy-link-btn"
  className='hover:opacity-90 active:stroke-themecolor'

  onClick={() => {
        setStroke('#078350');
        setTimeout(() => {
            setStroke('white');
        }, 150)
}}
  
>
  <g id="surface1">
    <path
      className="link-path"
      style={{
        fill: "none",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        stroke: stroke,
        strokeOpacity: 1,
        strokeMiterlimit: 4,
      }}
      d="M 9.170759 14.829241 L 14.829241 9.170759 M 7.051339 11.293527 L 5.635045 12.706473 C 4.074777 14.270089 4.074777 16.801339 5.635045 18.364955 C 7.198661 19.925223 9.733259 19.925223 11.293527 18.364955 L 12.706473 16.948661 M 11.293527 7.051339 L 12.706473 5.635045 C 14.270089 4.074777 16.801339 4.074777 18.364955 5.635045 C 19.925223 7.198661 19.925223 9.729911 18.364955 11.293527 L 16.948661 12.706473 "
      transform="matrix(1.166667,0,0,1.166667,0,0)"
    />
  </g>
</svg>
  )
}

export default CopyLinkIcon