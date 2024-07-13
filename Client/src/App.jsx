import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import Home from "./screen/home";

const queryClient = new QueryClient();
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#ffb840",
            fontFamily:'Poppins,sans-serif',
            fontWeightStrong:1000,
          },
          components: {
            Input: {
              controlHeightLG: 50,
            },
            Spin: {
              colorBgMask: " rgba(0, 0, 0, 0.121)",
              colorTextLightSolid: "#151515",
              colorWhite: "#151515",
              fontSize: 16,
              // fontFamily: "Poppins,sans-serif",
              fontFamilyCode:"Poppins,sans-serif"
            },
            Table:{
              fontFamily:'Poppins,sans-serif',
              cellFontSize:13
            }
          },
        }}
      >
        <Home />
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default App;
