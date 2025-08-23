import { GraphQLClient, gql, rawRequest, request } from 'graphql-request';
import crossFetch from 'cross-fetch';
import axios from 'axios';
import i18n from 'i18next';
import { PAY_ACCESS_TOKEN, PAY_REFRESH_TOKEN } from './LocalStorageVariables';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';

export async function graphqlApiBase(query, variables) {
  // const endpoint = "https://anarback.xyz";
  const endpoint = 'https://api.chenar.x9f4a7.onten.io/api/v1/';

  const client = new GraphQLClient(endpoint, {
    headers: {
      'access-token': localStorage.getItem(PAY_ACCESS_TOKEN),
    },
  });
  let isRefreshTokenExpired = false;
  // Overrides the clients headers with the passed values

  // const data = await client
  //   .rawRequest(query, variables)
  //   .then((res) => console.log(res))
  //   .catch((error) => console.log(error));

  // //   if(errors)
  // return data.data;
  //
  if (localStorage.getItem(PAY_REFRESH_TOKEN)) {
    const data = await client
      .rawRequest(query, variables)
      .then((res) => {
        //
        return res?.data;
      })
      .catch(async (error) => {
        //
        // if (
        //   error?.response?.errors?.[0]?.extensions?.code === "UNAUTHENTICATED"
        // ) {
        // client.stop()
        // }
        //
        if (
          error?.response?.errors?.[0]?.extensions?.code === 'UNAUTHENTICATED'
        ) {
          await axios
            .get(`${endpoint}/renewTokens`, {
              headers: {
                'access-token': localStorage.getItem(PAY_ACCESS_TOKEN),
                'refresh-token': localStorage.getItem(PAY_REFRESH_TOKEN),
              },
            })
            .then((res) => {
              //
              //

              localStorage.setItem(
                PAY_ACCESS_TOKEN,
                res?.data?.['access-token'],
              );
              localStorage.setItem(
                PAY_REFRESH_TOKEN,
                res?.data?.['refresh-token'],
              );
              //
              //
              graphqlApiBase(query, variables);
            })
            .catch((error) => {
              //
              if (error.response?.data === 'refresh token is invalid') {
                message.error(
                  i18n.t('Sales.All_sales.Invoice.Refresh_token_error_message'),
                );
                localStorage.removeItem(PAY_REFRESH_TOKEN);
              }
            });
        }
      });

    return data;
  } else {
    message.error(
      i18n.t('Sales.All_sales.Invoice.Refresh_token_error_message'),
    );
    return;
  }
}

// graphqlApiBase().catch((error) => console.error(error));
