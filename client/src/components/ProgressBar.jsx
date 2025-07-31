import {
  styled
} from '@mui/material/styles';

const Property1Quarter1 = styled("div")({
  display: `flex`,
  position: `relative`,
  isolation: `isolate`,
  flexDirection: `row`,
  width: `702px`,
  height: `20px`,
  justifyContent: `flex-start`,
  alignItems: `flex-start`,
  padding: `0px`,
  boxSizing: `border-box`,
});

const Rectangle28 = styled("div")({
  backgroundColor: `rgba(255, 246, 246, 1)`,
  border: `3px solid rgba(88, 129, 95, 1)`,
  boxSizing: `border-box`,
  borderRadius: `20px`,
  width: `702px`,
  height: `20px`,
  position: `absolute`,
  left: `162px`,
  top: `145px`,
});

const Rectangle29 = styled("div")({
  backgroundColor: `rgba(88, 129, 95, 1)`,
  borderRadius: `20px`,
  width: `175.5px`,
  height: `20px`,
  position: `absolute`,
  left: `162px`,
  top: `145px`,
});


function Property1Quarter() {
  return (
    <Property1Quarter1>
      <Rectangle28>
      </Rectangle28>
      <Rectangle29>
      </Rectangle29>
    </Property1Quarter1>);

  }

export default Property1Quarter;
