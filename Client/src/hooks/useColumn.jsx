import React from "react";

const useColumn = () => {
  const imgAltTextcolumns = [
    {
      title: "Alternative Text",
      dataIndex: "altText",
    },
    {
      title: "Image Source",
      dataIndex: "imgSrc",
      render: (text, _) => (
        <a className="font-Plight text-blue-600" target="_blank" href={text}>
          {text}
        </a>
      ),
    },
  ];

  const keywordColumns = [
    {
      title: "Keywords",
      dataIndex: "name",
    },
    {
      title: "Count",
      dataIndex: "value",
    },
  ];

  const faceBookopenGraphTagsColumns = [
    {
      title: "Property",
      dataIndex: "property",
    },
    {
      title: "Content",
      dataIndex: "content",
    },
  ];
  const depreactedHtmlColumns = [
    {
      title: "Element",
      dataIndex: "element",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
  ];

  const inlineStyleColumn = [
    {
      title: "Property Name",
      dataIndex: "name",
      width: 200,
    },
    {
      title: "Value",
      dataIndex: "value",
      render: (text, _) => {
        return text?.join(" , ");
      },
    },
  ];
  const pageSpeedInsightsColumn = [
    {
      title: "Type",
      dataIndex: "title",
    },
    {
      title: "Value",
      dataIndex: "value",
    },
  ];

  const optimizedImagesColumns = [
    {
      title: "Source",
      dataIndex: "src",
      render: (text, _) => (
        <a className="font-Plight text-blue-600" target="_blank" href={text}>
          {text}
        </a>
      ),
    },
    {
      title: "Height",
      dataIndex: "height",
    },
    {
      title: "Width",
      dataIndex: "width",
    },
  ];

  const backLinkColumns = [
    {
      title: "Top Back Links",
      render: (_, record) => (
        <a className="font-Plight text-blue-600" target="_blank" href={record}>
          {record}
        </a>
      ),
    },
  ];

  const jsErrorsColumns = [
    {
      title: "Javascript Errors",
      render: (_, record) => <p className="font-medium">{record}</p>,
    },
  ];

  const frienlyBackColumns = [
    {
      title: "Friendly Links",
      render: (_, record) => (
        <a className="font-Plight text-blue-600" target="_blank" href={record}>
          {record}
        </a>
      ),
    },
  ];

  const headingColumn = [
    {
      title: "Tag Name",
      dataIndex: "tagName",
      width: 120,
      render: (text, _) => text?.toUpperCase(),
    },
    {
      title: "Count",
      dataIndex: "value",
    },
    {
      title: "Content",
      dataIndex: "content",
      render: (text, _) => {
        return text?.length > 0
          ? text?.map((item, index) => (
              <div key={index}>
                <span className="font-Plight">{`${index + 1}.  ${item}`}</span>
              </div>
            ))
          : "-";
      },
    },
  ];

  return {
    imgAltTextcolumns,
    keywordColumns,
    inlineStyleColumn,
    headingColumn,
    depreactedHtmlColumns,
    frienlyBackColumns,
    jsErrorsColumns,
    faceBookopenGraphTagsColumns,
    backLinkColumns,
    optimizedImagesColumns,
    pageSpeedInsightsColumn,
  };
};

export default useColumn;
