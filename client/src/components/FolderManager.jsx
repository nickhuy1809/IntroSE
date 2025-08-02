import {
  styled
} from '@mui/material/styles';

import { useState, useEffect } from 'react';

import Button from './Button';

// Button group container
const ButtonGroup = styled("div")({
  display: "flex",
  flexDirection: "row",
  gap: "12px",
});

// Styled icon wrapper
const Icon = styled("svg")({
  width: "18px",
  height: "18px",
  fill: "white",
});

function EditButtonGroup() {
  return (
    <ButtonGroup>
      <button
      onClick={() => alert("Clicked!")}
      style={{
        all: 'unset',
        width: '32px',
        height: '32px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        }}
        >
        <Icon as="svg" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 3.75V14.25M3.75 9H14.25" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </Icon>
      </button>
      <button
      onClick={() => alert("Clicked!")}
      style={{
        all: 'unset',
        width: '32px',
        height: '32px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      <Icon as="svg" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 5.25V3H15V5.25M6.75 15H11.25M9 3V15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </Icon>
    </button>
    <button
      onClick={() => alert("Clicked!")}
      style={{
        all: 'unset',
        width: '32px',
        height: '32px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      <Icon as="svg" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Icon>
    </button>
    </ButtonGroup>
  );
}

const FolderButton1 = styled("div")({
  backgroundColor: `rgba(88, 129, 95, 1)`,
  borderRadius: `20px`,
  display: `flex`,
  position: `relative`,
  isolation: `isolate`,
  flexDirection: `row`,
  justifyContent: `flex-start`,
  alignItems: `center`,
  padding: `0px 10px`,
  boxSizing: `border-box`,
  height: `35px`,
  width: `325px`,
});

const Folder = styled("div")({
  textAlign: `center`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(248, 247, 227, 1)`,
  fontStyle: `normal`,
  fontFamily: `Exo`,
  fontWeight: `700`,
  fontSize: `24px`,
  letterSpacing: `0px`,
  textDecoration: `none`,
  textTransform: `none`,
  width: `158px`,
  height: `35px`,
  margin: `0px 0px 0px 10px`,
  overflow: `hidden`,
  textOverflow: `clip`,
});


function FolderButton() {
  return (
    <FolderButton1>
      <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
        <path d="M24.0625 13.7084L10.9375 6.1396M4.76875 10.15L17.5 17.5146L30.2313 10.15M17.5 32.2V17.5M30.625 23.3334V11.6667C30.6245 11.1552 30.4895 10.6529 30.2335 10.21C29.9775 9.76723 29.6096 9.39951 29.1667 9.14377L18.9583 3.31044C18.5149 3.05445 18.012 2.91968 17.5 2.91968C16.988 2.91968 16.4851 3.05445 16.0417 3.31044L5.83333 9.14377C5.39038 9.39951 5.02247 9.76723 4.76651 10.21C4.51054 10.6529 4.37552 11.1552 4.375 11.6667V23.3334C4.37552 23.8448 4.51054 24.3472 4.76651 24.79C5.02247 25.2328 5.39038 25.6005 5.83333 25.8563L16.0417 31.6896C16.4851 31.9456 16.988 32.0804 17.5 32.0804C18.012 32.0804 18.5149 31.9456 18.9583 31.6896L29.1667 25.8563C29.6096 25.6005 29.9775 25.2328 30.2335 24.79C30.4895 24.3472 30.6245 23.8448 30.625 23.3334Z" stroke="#F8F7E3" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <Folder>
        {`Main folder`}
      </Folder>
      <EditButtonGroup />
    </FolderButton1>);
  }

const FolderManager1 = styled("div")({
  display: `flex`,
  position: `relative`,
  isolation: `isolate`,
  flexDirection: `row`,
  width: `623px`,
  height: `410px`,
  justifyContent: `flex-start`,
  alignItems: `flex-start`,
  padding: `0px`,
  boxSizing: `border-box`,
});

const Rectangle31 = styled("div")({
  backgroundColor: `rgba(88, 129, 95, 0.5)`,
  border: `5px solid rgba(88, 129, 95, 1)`,
  boxSizing: `border-box`,
  width: `623px`,
  height: `360px`,
  position: `absolute`,
  left: `0px`,
  top: `50px`,
  padding: `5px`,
  flexDirection: 'column',
  display: 'flex',
  gap: '15px'
});

const Rectangle30 = styled("div")({
  backgroundColor: `rgba(88, 129, 95, 1)`,
  borderRadius: `20px 20px 0px 0px`,
  width: `180px`,
  height: `52px`,
  position: `absolute`,
  left: `0px`,
  top: `0px`,
});

const Folders = styled("div")({
  textAlign: `center`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(248, 247, 227, 1)`,
  fontStyle: `normal`,
  fontFamily: `Exo`,
  fontWeight: `700`,
  fontSize: `24px`,
  letterSpacing: `0px`,
  textDecoration: `none`,
  textTransform: `none`,
  width: `110px`,
  height: `32px`,
  position: `absolute`,
  left: `51px`,
  top: `10px`,
});

const StyledFolderButton = styled(FolderButton)({
  width: `223px`,
  height: `35px`,
});

function FolderManager() {
  return (
    <FolderManager1>
      <div style={{ position: "absolute", top: "58px", left: "428px", zIndex: 2 }}>
        <Button />
      </div>
      
      <Rectangle31>
        <StyledFolderButton/>
        <StyledFolderButton/>
        <StyledFolderButton/>
        <StyledFolderButton/>
        <StyledFolderButton/>
      </Rectangle31>
      <Rectangle30>
      </Rectangle30>
      <Folders>
        {`Folders`}
      </Folders>
      <div style={{
        width: "35px",
        height: "35px",
        position: "absolute",
        left: "16px",
        top: "9px"
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
          <path d="M32.0837 17.5H23.3337L20.417 21.875H14.5837L11.667 17.5H2.91699M32.0837 17.5V26.25C32.0837 27.0235 31.7764 27.7654 31.2294 28.3124C30.6824 28.8594 29.9405 29.1666 29.167 29.1666H5.83366C5.06011 29.1666 4.31824 28.8594 3.77126 28.3124C3.22428 27.7654 2.91699 27.0235 2.91699 26.25V17.5M32.0837 17.5L27.0524 7.45206C26.8109 6.96613 26.4387 6.55719 25.9776 6.27122C25.5164 5.98525 24.9846 5.8336 24.442 5.83331H10.5587C10.016 5.8336 9.48425 5.98525 9.0231 6.27122C8.56195 6.55719 8.18971 6.96613 7.94824 7.45206L2.91699 17.5" stroke="#F8F7E3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </FolderManager1>);
  }

export default FolderManager;

  