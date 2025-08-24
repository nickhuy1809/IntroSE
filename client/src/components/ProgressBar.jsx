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
  width: `100%`,
  height: `20px`,
  position: `absolute`,
  left: `162px`,
  top: `145px`,
});

const Rectangle29 = styled("div")(({ progress }) => ({
  background: `linear-gradient(90deg, #598b48ff, #f1b24a)`,
  borderRadius: `20px`,
  width: `${Math.max(0, Math.min(100, progress || 0))}%`,
  height: `20px`,
  position: `absolute`,
  left: `162px`,
  top: `145px`,
  transition: 'width 0.3s ease',
}));

function ProgressBar({ progress = 0 }) {
  return (
    <Property1Quarter1>
      <Rectangle28 />
      <Rectangle29 progress={progress} />
    </Property1Quarter1>
  );
}

export default ProgressBar;