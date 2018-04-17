import React from "react";
import App from "./App";
import { mount } from "enzyme";
import getExchangesPositionsResp from "./mocks/getExchangesPositionsResp.json";
import transformExchangeDataResponse from "./mocks/transformExchangeDataResponse.json";
import convertToHistoricDataResponse from "./mocks/convertToHistoricDataResponse.json";
import toJson from "enzyme-to-json";
import { Tab } from "material-ui/Tabs";

const exchange = require("./api/exchange");
jest.mock("./api/exchange", () => ({
  getExchangesPositions: jest.fn()
}));

const dataConverters = require("./utils/dataConverters");
jest.mock("./utils/dataConverters", () => ({
  convertToCurrentData: jest.fn(),
  convertToHistoric: jest.fn()
}));

describe("App", () => {
  exchange.getExchangesPositions.mockImplementation(() => Promise.resolve(getExchangesPositionsResp));

  describe("Deep CurrentView testing", () => {
    dataConverters.convertToCurrentData.mockImplementation(() => transformExchangeDataResponse);

    it("should render loaded data", () => {
      const wrapper = mount(
        <App />
      );
      expect(toJson(wrapper, { mode: "deep" })).toMatchSnapshot();
    });
  });

});

describe("Deep HistoricView testing", () => {
  dataConverters.convertToHistoric.mockImplementation(() => convertToHistoricDataResponse);

  it("should render with loaded data", () => {
    const wrapper = mount(
      <App />
    );
    wrapper.find(Tab).at(1).find("button").simulate("click");
    wrapper.instance().forceUpdate();
    wrapper.update();
    expect(toJson(wrapper, { mode: "deep" })).toMatchSnapshot();
  });
});
