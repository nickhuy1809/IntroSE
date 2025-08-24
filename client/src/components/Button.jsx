import { styled } from '@mui/material/styles';

const ButtonRoot = styled("div")({
  display: `flex`,
  position: `relative`,
  isolation: `isolate`,
  flexDirection: `row`,
  width: `187.65px`,
  height: `51.07px`,
  justifyContent: `flex-start`,
  alignItems: `flex-start`,
  padding: `0px`,
  boxSizing: `border-box`,
  cursor: `pointer`,
  transition: 'transform 0.1s ease-in-out',
  '&:active': {
    transform: 'scale(0.8)' // Thêm hiệu ứng nhấn nút
  }
});

const Rectangle = styled("div")({
  backgroundColor: `#ffa600`,
  borderRadius: `50px`,
  width: `187.65px`,
  height: `51.07px`,
  position: `absolute`,
  left: `0px`,
  top: `0px`,
});

const NewTask = styled("div")({
  textAlign: `center`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(255, 255, 255, 1)`,
  fontStyle: `normal`,
  fontFamily: `EB Garamond`,
  fontWeight: `1000`,
  fontSize: `24px`,
  letterSpacing: `0px`,
  textDecoration: `none`,
  textTransform: `none`,
  width: `165px`,
  height: `27px`,
  position: `absolute`,
  left: `11px`,
  top: `12px`,
});

function Button({ label = "+ New task", onClick }) {
  return (
    <ButtonRoot onClick={onClick}>
      <Rectangle />
      <NewTask>
        {label}
      </NewTask>
    </ButtonRoot>
  );
}

export default Button;