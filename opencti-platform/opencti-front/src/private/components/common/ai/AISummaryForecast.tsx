import { graphql, PreloadedQuery, usePreloadedQuery } from 'react-relay';
import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
import parse from 'html-react-parser';
import { AISummaryForecastQuery } from './__generated__/AISummaryForecastQuery.graphql';
import useQueryLoading from '../../../../utils/hooks/useQueryLoading';
import { useFormatter } from '../../../../components/i18n';
import Loader, { LoaderVariant } from '../../../../components/Loader';
import { aiRotatingTexts, getDefaultAiLanguage } from '../../../../utils/ai/Common';

const aISummaryForecastQuery = graphql`
  query AISummaryForecastQuery($id: ID!, $language: String) {
      stixCoreObjectAiForecast(id: $id, language: $language) {
        result
        updated_at
    }
  }
`;

interface AISummaryForecastComponentProps {
  queryRef: PreloadedQuery<AISummaryForecastQuery>;
  language: string;
  setLanguage: (language: string) => void;
}

const AISummaryForecastComponent = ({ queryRef }: AISummaryForecastComponentProps) => {
  const { t_i18n } = useFormatter();
  const { stixCoreObjectAiForecast } = usePreloadedQuery(
    aISummaryForecastQuery,
    queryRef,
  );
  if (stixCoreObjectAiForecast && stixCoreObjectAiForecast.result) {
    return (
      <>
        {parse(stixCoreObjectAiForecast.result)}
        <Alert severity="info" variant="outlined" style={{ marginTop: 20 }}>
          {t_i18n('This forecast is based on the evolution of the activity of this entity (indicators, victimology, etc.). It has been generated by AI and can contain mistakes.')}
        </Alert>
      </>
    );
  }
  return (
    <div
      style={{
        display: 'table',
        height: '100%',
        width: '100%',
        paddingTop: 15,
        paddingBottom: 15,
      }}
    >
      <span
        style={{
          display: 'table-cell',
          verticalAlign: 'middle',
          textAlign: 'center',
        }}
      >
        {t_i18n('No AI Intelligence.')}
      </span>
    </div>
  );
};

interface AISummaryForecastProps {
  id: string
}

const AISummaryForecast = ({ id }: AISummaryForecastProps) => {
  const defaultLanguageName = getDefaultAiLanguage();
  const [language, setLanguage] = useState(defaultLanguageName);
  const queryRef = useQueryLoading<AISummaryForecastQuery>(aISummaryForecastQuery, { id, language });
  return (
    <>
      {queryRef ? (
        <React.Suspense fallback={<Loader variant={LoaderVariant.inElement} rotatingTexts={aiRotatingTexts} />}>
          <AISummaryForecastComponent
            queryRef={queryRef}
            language={language}
            setLanguage={setLanguage}
          />
        </React.Suspense>
      ) : (
        <Loader variant={LoaderVariant.inElement} rotatingTexts={aiRotatingTexts} />
      )}
    </>
  );
};

export default AISummaryForecast;
