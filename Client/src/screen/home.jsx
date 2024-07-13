import { useQuery } from "@tanstack/react-query";
import { Collapse, Input, Progress, Spin, Tabs } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaLink } from "react-icons/fa6";
import "tailwindcss/tailwind.css";
import { DataTable, EmptyComponent } from "../component";
import useColumn from "../hooks/useColumn";

const { Search } = Input;
const { Panel } = Collapse;
const Home = () => {
  const [url, setUrl] = useState(null);
  const [responseData, setResponseData] = useState([]);
  const { data, isLoading } = useQuery({
    queryKey: ["seoData", url],
    queryFn: async () => await axios.get(`/api?url=${url}`),
    refetchOnWindowFocus: false,
    enabled: Boolean(url),
  });

  const { data: domainData, isLoading: domainLoading } = useQuery({
    queryKey: ["domainData", url],
    queryFn: async () => await axios.get(`/api/domain/?url=${url}`),
    refetchOnWindowFocus: false,
    enabled: Boolean(url),
  });

  useEffect(() => {
    data?.data?.seoData && setResponseData(data?.data?.seoData);
  }, [data?.data?.seoData]);

  const {
    imgAltTextcolumns,
    backLinkColumns,
    depreactedHtmlColumns,
    faceBookopenGraphTagsColumns,
    frienlyBackColumns,
    inlineStyleColumn,
    jsErrorsColumns,
    keywordColumns,
    headingColumn,
    optimizedImagesColumns,
    pageSpeedInsightsColumn,
  } = useColumn();

  const groupInlineStyles = (inlineStyle) => {
    const result = [];
    for (const [propertyName, propertyValues] of Object.entries(inlineStyle)) {
      result?.push({
        name: propertyName,
        value: propertyValues,
      });
    }
    return result;
  };

  console.log(responseData);

  const getCount = (array, key) => {
    return Math.floor(array?.find((item) => item?.title === key)?.value);
  };

  const RenderTabs = ({ data }) => (
    <div className="my-8 flex flex-row items-center justify-center gap-14 flex-wrap">
      <div className="items-center flex flex-col">
        <Progress type="circle" percent={getCount(data, "accessibility")} />
        <h3 className="font-Pmedium mt-1.5">Accessibility</h3>
      </div>
      <div className="items-center flex flex-col">
        <Progress type="circle" percent={getCount(data, "Performance Score")} />
        <h3 className="font-Pmedium mt-1.5">Performance</h3>
      </div>
      <div className="items-center flex flex-col">
        <Progress type="circle" percent={getCount(data, "best-practices")} />
          <h3 className="font-Pmedium mt-1.5">Best Practices</h3>
        </div>
      <div className="items-center flex flex-col">
        <Progress type="circle" percent={getCount(data, "seo")} />
        <h3 className="font-Pmedium mt-1.5">SEO</h3>
      </div>
    </div>
  );

  const items = [
    {
      key: "1",
      label: "Mobile",
      children: <RenderTabs data={responseData?.pageSpeedInsightsMobile} />,
    },
    {
      key: "2",
      label: "Dasktop",
      children: <RenderTabs data={responseData?.pageSpeedInsightsDesktop} />,
    },
  ];

  const panelStyle = {
    marginBottom: 20,
    background: "rgba(0, 0, 0, 0.06)",
    borderRadius: 8,
    border: "none",
    fontFamily: "poppins",
    fontWeight: 800,
  };
  return (
    <>
      <Spin
        spinning={isLoading || domainLoading}
        tip="SEO report is auditing. Please wait..."
        fullscreen
        size="large"
      />
      <Toaster />
      <div className="flex flex-col justify-center items-center my-10 mx-2">
        <h1 className="font-PsemiBold text-2xl md:text-6xl   inline">
          SEO Audit & Reporting Tool
        </h1>
        <img
          color="red"
          src="https://www.seoptimer.com/frontend-new/images/shape/line-shape-11.svg"
          width={300}
        />
        <p className="font-Plight mx-2 text-[#151515] text-lg my-2">
          Enter an URL address and get a Free Website Analysis!
        </p>
        <div className="w-[90%] my-5 sm:w-[50%] md:w-[40%]">
          <Search
            placeholder="Example.com"
            enterButton="Audit"
            size="large"
            allowClear
            variant="outlined"
            prefix={<FaLink className="mx-1.5" color="#151515" />}
            loading={false}
            style={{ height: "50px" }}
            onSearch={(value) => {
              if (value.startsWith("http")) {
                setUrl(value);
              } else {
                toast.error(
                  "Please provide the full website URL, including https or http",
                  { position: "top-right" }
                );
              }
            }}
          />
        </div>
      </div>
      {Object.keys(responseData)?.length > 0 && (
        <div className="sm:mx-10 mx-3">
          <Tabs type="card" defaultActiveKey="1" items={items} centered />
          <Collapse className="p-2 bg-white" defaultActiveKey={["1"]}>
            <Panel style={panelStyle} header="Domain Details" key="1">
              <p className="font-medium">
                <span className="font-bold">Domain Name :</span>{" "}
                {domainData?.data?.response?.domainName || "-"}
              </p>
              <p className="font-medium mt-1">
                <span className="font-bold">Creation Date :</span>{" "}
                {moment(domainData?.data?.response?.creationDate).format(
                  "DD-MM-YYYY  h:mm A"
                ) || "-"}
              </p>
              <p className="font-medium mt-1">
                <span className="font-bold">Updated Date :</span>{" "}
                {moment(domainData?.data?.response?.updatedDate).format(
                  "DD-MM-YYYY  h:mm A"
                ) || "-"}
              </p>
              <p className="font-medium mt-1">
                <span className="font-bold">Expiry Date :</span>{" "}
                {moment(domainData?.data?.response?.registryExpiryDate).format(
                  "DD-MM-YYYY  h:mm A"
                ) || "-"}
              </p>
            </Panel>
            <Panel style={panelStyle} header="Title Tag" key="2">
              <p className="font-medium">
                <span className="font-bold">Title :</span>{" "}
                {responseData?.title?.titleText}
              </p>
              <p className="font-medium mt-1">
                <span className="font-bold">Length :</span>{" "}
                {responseData?.title?.titleLength}
              </p>
            </Panel>
            <Panel style={panelStyle} header="Meta Description Tag" key="3">
              <div className="flex flex-col gap-y-4">
                {responseData?.metaTag?.length > 0 ? (
                  responseData?.metaTag?.map((item, index) => (
                    <div key={index} className="border-2 p-2 rounded-lg">
                      <p className="font-medium">
                        <span className="font-bold">Length :</span>{" "}
                        {item?.contentLength}
                      </p>
                      <p className="font-medium mt-1">
                        <span className="font-bold">Description :</span>{" "}
                        {item?.descriptionContent}
                      </p>
                    </div>
                  ))
                ) : (
                  <EmptyComponent />
                )}
              </div>
            </Panel>
            <Panel style={panelStyle} header="Hreflang Usage" key="4">
              <div className="flex flex-col gap-y-4">
                {responseData?.hreflang?.length > 0 ? (
                  responseData?.hreflang?.map((item, index) => (
                    <div key={index} className="border-2 p-2 rounded-lg">
                      <p className="font-medium">
                        <span className="font-bold">Value :</span> {item?.value}
                      </p>
                      <p className="font-medium mt-1">
                        <span className="font-bold">Href :</span> {item?.href}
                      </p>
                    </div>
                  ))
                ) : (
                  <EmptyComponent />
                )}
              </div>
            </Panel>
            <Panel style={panelStyle} header="Language" key="5">
              <p className="font-medium">
                <span className="font-bold">Language :</span>{" "}
                {responseData?.langugae}
              </p>
            </Panel>
            <Panel style={panelStyle} header="Header Tag Usage" key="6">
              <DataTable
                columns={headingColumn}
                dataSource={responseData?.headings}
                scrollX={900}
                pagination={false}
              />
            </Panel>
            <Panel style={panelStyle} header=" Image Alt Attributes" key="7">
              <DataTable
                columns={imgAltTextcolumns}
                dataSource={responseData?.imgAltText}
                scrollX={900}
              />
            </Panel>
            <Panel style={panelStyle} header="Canonical Tag" key="8">
              <div>
                {responseData?.canonicalLink?.length > 0 ? (
                  responseData?.canonicalLink?.map((item, index) => (
                    <p key={index} className="font-medium">
                      <span className="font-bold">{`Link ${
                        index + 1
                      } :-`}</span>
                      &nbsp;
                      {item}
                    </p>
                  ))
                ) : (
                  <EmptyComponent />
                )}
              </div>
            </Panel>
            <Panel style={panelStyle} header="Noindex Tag Test" key="9">
              <p className="font-medium">
                {responseData?.NoindexTag
                  ? "This page has a noindex directive."
                  : "Noindex meta tag not found."}
              </p>
            </Panel>
            <Panel style={panelStyle} header="Noindex Header Test" key="10">
              <p className="font-medium">
                This website is
                {responseData?.NoindexHeader ? " using " : " not using "}a
                Noindex header.
              </p>
            </Panel>
            <Panel style={panelStyle} header="SSL Enabled" key="11">
              <p className="font-medium">
                {`SSL is ${
                  responseData?.sslEnable ? "enabled" : "not enabled"
                } for this website.`}
              </p>
            </Panel>
            <Panel style={panelStyle} header="HTTPS Redirect" key="12">
              <p className="font-medium">
                {`This website  ${
                  responseData?.httpsRedirect ? "has" : "does not have"
                } an HTTP to HTTPS redirect link.`}
              </p>
            </Panel>
            <Panel style={panelStyle} header="Robots.txt" key="13">
              <p className="font-medium">{responseData?.robotsText}</p>
            </Panel>
            <Panel
              style={panelStyle}
              header="Schema.org Structured Data"
              key="14"
            >
              {responseData?.schemaData ? (
                <div>
                  <p className="font-medium my-2">
                    {" "}
                    <span className="font-bold">Name : </span>
                    {responseData?.schemaData?.name}
                  </p>
                  <img
                    src={responseData?.schemaData?.logo}
                    className="border-2  my-2 rounded-md bg-contain h-20 w-20"
                  />
                  <p className="font-bold my-1">Social Media Links :</p>
                  <div className="">
                    {responseData?.schemaData?.sameAs?.map((item, index) => (
                      <p
                        key={index}
                        className=" my-2  cursor-pointer font-Plight"
                      >
                        {`Link ${index + 1} : `}{" "}
                        <a
                          className="font-Plight break-words text-blue-600"
                          href={item}
                          target="_blank"
                        >
                          {item}
                        </a>
                      </p>
                    ))}
                  </div>
                  <p className="font-medium my-2">
                    {" "}
                    <span className="font-bold">Address : </span>
                    {`${responseData?.schemaData?.address?.streetAddress} , ${responseData?.schemaData?.address?.addressCountry} , ${responseData?.schemaData?.address?.addressRegion},${responseData?.schemaData?.address?.postalCode}`}
                  </p>
                </div>
              ) : (
                <EmptyComponent />
              )}
            </Panel>
            <Panel style={panelStyle} header="Top Back Links" key="15">
              <DataTable
                columns={backLinkColumns}
                scrollX={900}
                dataSource={responseData?.topBacklinks}
              />
            </Panel>
            <Panel style={panelStyle} header="Friendly Links" key="16">
              <DataTable
                columns={frienlyBackColumns}
                dataSource={responseData?.friendlyLinks}
              />
            </Panel>
            <Panel style={panelStyle} header="Flash Used?" key="17">
              <p className="font-medium">
                {`This website  ${
                  responseData?.isFlashUsed ? "" : "does not"
                } uses Flash.`}
              </p>
            </Panel>
            <Panel style={panelStyle} header="iFrames Used?" key="18">
              <p className="font-medium">
                This website uses{" "}
                <span className="font-bold">{responseData?.iframe}</span>{" "}
                iframes.
              </p>
            </Panel>
            <Panel style={panelStyle} header="Favicon" key="19">
              <p className=" my-2 cursor-pointer font-bold">
                Source :{" "}
                <a
                  className="font-Plight text-blue-600"
                  href={responseData?.favIcons}
                  target="_blank"
                >
                  {responseData?.favIcons}
                </a>
              </p>
            </Panel>
            <Panel style={panelStyle} header="Email Privacy" key="20">
              {responseData?.emailPrivacy?.length > 0 ? (
                responseData?.emailPrivacy?.map((item, index) => (
                  <p key={index} className="font-Plight my-2">
                    {" "}
                    <span>{`${index + 1} : `}</span>
                    <a
                      href={`mailto:${item}`}
                      className="font-Plight text-blue-600"
                    >
                      {item}
                    </a>
                  </p>
                ))
              ) : (
                <EmptyComponent />
              )}
            </Panel>
            <Panel style={panelStyle} header="Legible Font Sizes" key="21">
              <p className="font-medium">
                {responseData?.LegibleFontSizes
                  ? "This website has legible font sizes."
                  : "This website may have font sizes that are too small to be legible."}
              </p>
            </Panel>
            <Panel style={panelStyle} header="Download Page Size" key="22">
              <p className="font-medium my-2">
                The physical page size of this website for printing or PDF
                generation is{" "}
                <span className="font-bold">
                  {responseData?.pageSize ?? "not specified."}
                </span>
              </p>
            </Panel>
            <Panel style={panelStyle} header="Number of Resources" key="23">
              {responseData?.numberofResources?.map((item, index) => (
                <p key={index} className="font-medium my-2">
                  {`${item?.name} : `}
                  <span className="font-bold">{item?.value}</span>
                </p>
              ))}
            </Panel>
            <Panel
              style={panelStyle}
              header="Google Accelerated Mobile Pages (AMP)"
              key="24"
            >
              <p className="font-medium">
                {responseData?.isAMPPage
                  ? "This webpage follows Google Accelerated Mobile Pages (AMP) guidelines, ensuring faster and more optimized mobile browsing experience."
                  : "This webpage does not utilize Google Accelerated Mobile Pages (AMP) technology."}
              </p>
            </Panel>
            <Panel style={panelStyle} header="JavaScript Errors" key="25">
              <DataTable
                columns={jsErrorsColumns}
                scrollX={900}
                dataSource={responseData?.javascriptErrors}
              />
            </Panel>
            <Panel style={panelStyle} header="HTTP2 Usag" key="26">
              <p className="font-medium">
                {responseData?.http2Used
                  ? "This website is using HTTP/2."
                  : "This website is not using HTTP/2."}
              </p>
            </Panel>
            <Panel style={panelStyle} header="Keyword Consistency" key="27">
              <DataTable
                columns={keywordColumns}
                dataSource={responseData?.keywordConsistency}
              />
            </Panel>
            <Panel style={panelStyle} header="Optimize Images" key="28">
              <DataTable
                columns={optimizedImagesColumns}
                dataSource={responseData?.optimizedImages}
                scrollX={900}
              />
            </Panel>
            <Panel style={panelStyle} header="Deprecated HTML" key="29">
              <DataTable
                columns={depreactedHtmlColumns}
                dataSource={responseData?.deprecatedItems}
              />
            </Panel>
            <Panel style={panelStyle} header="Inline Styles" key="30">
              <DataTable
                columns={inlineStyleColumn}
                dataSource={groupInlineStyles(responseData?.inlineStyles)}
                Datalength={Object.keys(responseData?.inlineStyles)?.length}
              />
            </Panel>
            <Panel style={panelStyle} header="Facebook Page Linked" key="31">
              {responseData?.facebookPageLink?.length > 0 ? (
                responseData?.facebookPageLink?.map((item, index) => (
                  <a
                    key={index}
                    href={item}
                    target="_blank"
                    className="font-Plight text-blue-600 my-2 break-words"
                  >
                    {" "}
                    <span className="font-bold text-black">{`${
                      index + 1
                    } : `}</span>
                    {item}
                  </a>
                ))
              ) : (
                <EmptyComponent />
              )}
            </Panel>

            <Panel style={panelStyle} header="Instagram Linked" key="32">
              {responseData?.insagramPageLink?.length > 0 ? (
                responseData?.insagramPageLink?.map((item, index) => (
                  <a
                    key={index}
                    href={item}
                    target="_blank"
                    className="font-Plight text-blue-600 my-2 break-words "
                  >
                    {" "}
                    <span className="font-bold text-black">{`${
                      index + 1
                    } : `}</span>
                    {item}
                  </a>
                ))
              ) : (
                <EmptyComponent />
              )}
            </Panel>
            <Panel style={panelStyle} header="LinkedIn Page Linked" key="33">
              {responseData?.linkedinPageLink?.length > 0 ? (
                responseData?.linkedinPageLink?.map((item, index) => (
                  <a
                    key={index}
                    href={item}
                    target="_blank"
                    className="font-Plight text-blue-600 my-2 break-words"
                  >
                    {" "}
                    <span className="font-bold text-black">{`${
                      index + 1
                    } : `}</span>
                    {item}
                  </a>
                ))
              ) : (
                <EmptyComponent />
              )}
            </Panel>
            <Panel style={panelStyle} header="YouTube Channel Linked" key="34">
              {responseData?.youtubePageLink?.length > 0 ? (
                responseData?.youtubePageLink?.map((item, index) => (
                  <a
                    key={index}
                    href={item}
                    target="_blank"
                    className="font-Plight text-blue-600 my-2 break-words"
                  >
                    {" "}
                    <span className="font-bold text-black">{`${
                      index + 1
                    } : `}</span>
                    {item}
                  </a>
                ))
              ) : (
                <EmptyComponent />
              )}
            </Panel>
            <Panel
              style={panelStyle}
              header="Facebook Open Graph Tags"
              key="35"
            >
              <DataTable
                columns={faceBookopenGraphTagsColumns}
                dataSource={responseData?.faceBookopenGraphTags}
              />
            </Panel>
            <Panel
              style={panelStyle}
              header="Address & Phone Shown on Website"
              key="36"
            >
              <p className="font-medium">
                <span className="font-bold">Phone Number :</span>{" "}
                {responseData?.phoneNumber || "-"}
              </p>
              <p className="font-medium mt-1">
                <span className="font-bold">Address :</span>{" "}
                {responseData?.address || "-"}
              </p>
            </Panel>
            <Panel style={panelStyle} header="Server IP Address" key="37">
              {responseData?.serverIpAddress?.length > 0 ? (
                responseData?.serverIpAddress?.map((item, index) => (
                  <p key={index} className="font-medium my-2">
                    {" "}
                    <span className="font-bold">{`IP Address ${
                      index + 1
                    } :-> `}</span>
                    {item}
                  </p>
                ))
              ) : (
                <EmptyComponent />
              )}
            </Panel>
            <Panel style={panelStyle} header="DNS Servers" key="38">
              {responseData?.dnsServer?.length > 0 ? (
                responseData?.dnsServer?.map((item, index) => (
                  <p key={index} className="font-medium my-2">
                    {" "}
                    <span className="font-bold">{`DNS Address ${
                      index + 1
                    } :-> `}</span>
                    {item}
                  </p>
                ))
              ) : (
                <EmptyComponent />
              )}
            </Panel>
            <Panel style={panelStyle} header="Web Server" key="39">
              {responseData?.webServer ? (
                <p className="font-medium my-2">
                  This website is hosted using{" "}
                  <span className="font-bold">{responseData?.webServer}</span>.
                </p>
              ) : (
                <EmptyComponent />
              )}
            </Panel>
            <Panel style={panelStyle} header="Charset" key="40">
              {responseData?.charset ? (
                <p className="font-medium my-2">
                  This website is encoded using{" "}
                  <span className="font-bold">{responseData?.charset}</span>{" "}
                  character encoding.
                </p>
              ) : (
                <EmptyComponent />
              )}
            </Panel>

            <Panel
              style={panelStyle}
              header="Google's PageSpeed Insights - Mobile"
              key="41"
            >
              <DataTable
                columns={pageSpeedInsightsColumn}
                dataSource={responseData?.pageSpeedInsightsMobile}
                scrollX={900}
              />
            </Panel>
            <Panel
              style={panelStyle}
              header="Google's PageSpeed Insights - Desktop"
              key="42"
            >
              <DataTable
                columns={pageSpeedInsightsColumn}
                dataSource={responseData?.pageSpeedInsightsDesktop}
                scrollX={900}
              />
            </Panel>
          </Collapse>
        </div>
      )}
    </>
  );
};

export default Home;
