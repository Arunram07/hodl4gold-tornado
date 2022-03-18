import React from "react";
import { useQuery } from "urql";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import moment from "moment";

const query = `
query ($amount: String!, $currency: String! ) {
  deposits(last: 10,where:{amount: $amount ,currency: $currency},
  orderBy:timestamp,orderDirection:desc) {
    id
    index
    amount
    currency
    timestamp
  }
}
`;

interface IStatsProps {
  amount: string;
  currency: string;
}

const Stats: React.FC<IStatsProps> = ({ amount, currency }) => {
  const [result] = useQuery({
    query,
    variables: { amount, currency },
  });

  const { fetching, data, error } = result;
  console.log(fetching, data);
  const renderError = (
    <div className="stats_error">
      <p>Something went wrong</p>
    </div>
  );

  const renderStats = (
    <>
      {fetching ? (
        <div className="stats_grid">
          <div>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                baseColor="#202020"
                highlightColor="#444"
                className="skeleton-loader"
              />
            ))}
          </div>
          <div>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                baseColor="#171717"
                highlightColor="#444"
                className="skeleton-loader"
              />
            ))}
          </div>
        </div>
      ) : !data?.deposits?.length ? (
        <div className="stats_error">
          <p>No History Found</p>
        </div>
      ) : (
        <div className="stats_grid">
          <div>
            {data?.deposits?.slice(0, 5).map((val) => (
              <p key={val.id}>
                <b>{`${val.index} `}.&nbsp;</b>
                <span>{moment(Number(val.timestamp) * 1000).fromNow()}</span>
              </p>
            ))}
          </div>
          <div>
            {data?.deposits?.slice(5, 10).map((val) => (
              <p key={val.id}>
                <b>{val.index}.&nbsp;</b>
                <span>{moment(Number(val.timestamp) * 1000).fromNow()}</span>
              </p>
            ))}
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="home_stats_container">
      <div className="home_stats_container-header">
        <h2>
          Statistics <span>1 ETH</span>
        </h2>
      </div>
      <div className="home_stats_container-content">
        <p>Anonymity set</p>
        <p className="md mt-10 mb-20"></p>
        <p className="md mt-10 mb-20">equal user deposits</p>

        <b>Latest deposits</b>

        {error ? renderError : renderStats}
      </div>
    </div>
  );
};

export default Stats;
