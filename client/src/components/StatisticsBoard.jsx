import {
  styled
} from '@mui/material/styles';

const StatisticsBoard1 = styled("div")({
  display: `flex`,
  position: `relative`,
  isolation: `isolate`,
  flexDirection: `row`,
  width: `623px`,
  height: `669px`,
  justifyContent: `flex-start`,
  alignItems: `flex-start`,
  padding: `0px`,
  boxSizing: `border-box`,
});

const Rectangle31 = styled("div")({
  backgroundColor: `#dbe5d1`,
  border: `5px solid #164a41`,
  boxSizing: `border-box`,
  width: `623px`,
  height: `669px`,
  position: `absolute`,
  left: `0px`,
  top: `0px`,
});

const Rectangle30 = styled("div")({
  backgroundColor: `#164a41`,
  borderRadius: `0px 0px 20px 0px`,
  width: `180px`,
  height: `52px`,
  position: `absolute`,
  left: `4px`,
  top: `4px`,
});

const Statistics = styled("div")({
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
  left: `56px`,
  top: `15px`,
});

const Frame8 = styled("div")({
  display: `flex`,
  position: `absolute`,
  isolation: `isolate`,
  flexDirection: `row`,
  justifyContent: `flex-start`,
  alignItems: `flex-start`,
  padding: `10px`,
  boxSizing: `border-box`,
  width: `612px`,
  left: `5px`,
  top: `56px`,
  overflow: `auto`,
  height: `609px`,
  overflowY: "overlay",
  "&::-webkit-scrollbar": {
    width: "8px",
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "rgba(88,129,95,0.5)",
    borderRadius: "4px",
  },
});

const ScoreSummaryAverageS = styled("div")({
  textAlign: `left`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(88, 129, 95, 1)`,
  fontStyle: `normal`,
  fontFamily: `Baskerville`,
  fontWeight: `1000`,
  fontSize: `24px`,
  letterSpacing: `0px`,
  textDecoration: `none`,
  textTransform: `none`,
  margin: `0px`,
  width: '100%',
});


function StatisticsBoard({ analysisResult, isLoading, error }) {
  const renderContent = () => {
    if (isLoading) {
      return <ScoreSummaryAverageS> AI analysing...</ScoreSummaryAverageS>;
    }

    if (error) {
      return <ScoreSummaryAverageS> Error occurred: {error}</ScoreSummaryAverageS>;
    }

    if (!analysisResult) {
      return <ScoreSummaryAverageS>Please select a folder to view AI learning analysis.</ScoreSummaryAverageS>;
    }
    
    // Xử lý các thông điệp đơn giản từ backend (ví dụ: chưa có khóa học/điểm)
    if (analysisResult.motivationalMessage && !analysisResult.overallSummary) {
        return <ScoreSummaryAverageS>{analysisResult.motivationalMessage}</ScoreSummaryAverageS>;
    }
    
    // Xử lý trường hợp AI trả về lỗi parsing
    if (analysisResult.error) {
         return <ScoreSummaryAverageS>Error from AI: {analysisResult.message}</ScoreSummaryAverageS>
    }

    // Trường hợp thành công, hiển thị đầy đủ kết quả phân tích
    const { overallSummary, strengths, areasForImprovement, motivationalMessage } = analysisResult;

    return (
        <ScoreSummaryAverageS>
            {` Overview:\n${overallSummary}\n\n` +
             ` Strengths:\n- ${strengths.join('\n- ')}\n\n` +
             ` Areas for Improvement:\n- ${areasForImprovement.join('\n- ')}\n\n` +
             ` Motivational Message:\n${motivationalMessage}`
            }
        </ScoreSummaryAverageS>
    );
  };

  return (
    <StatisticsBoard1>
      <Rectangle31 />
      <Rectangle30 />
      <Statistics>
        {`Statistics`}
      </Statistics>
      <div style={{
        position: "absolute",
        left: "21px",
        top: "14px",
        width: "35px",
        height: "35px"
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
          <g clipPath="url(#clip0_157_2541)">
            <path d="M30.9313 23.173C30.0035 25.367 28.5524 27.3004 26.7048 28.8041C24.8572 30.3077 22.6695 31.3359 20.3327 31.7987C17.996 32.2615 15.5814 32.1449 13.3002 31.459C11.019 30.773 8.94049 29.5387 7.24649 27.864C5.55248 26.1892 4.29452 24.1249 3.58259 21.8517C2.87066 19.5784 2.72644 17.1654 3.16254 14.8235C3.59863 12.4816 4.60176 10.2822 6.08423 8.41762C7.5667 6.553 9.48337 5.07992 11.6667 4.12716M32.0833 17.5001C32.0833 15.585 31.7061 13.6886 30.9732 11.9193C30.2404 10.15 29.1662 8.5423 27.812 7.18811C26.4578 5.83392 24.8501 4.75972 23.0808 4.02684C21.3115 3.29396 19.4151 2.91675 17.5 2.91675V17.5001H32.0833Z" stroke="#F8F7E3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
          <defs>
            <clipPath id="clip0_157_2541">
              <rect width="35" height="35" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      </div>
      <Frame8>
        {/* {renderContent()} */}
      </Frame8>
    </StatisticsBoard1>
  );
}

export default StatisticsBoard;

  