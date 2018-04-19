import React from "react";
import App from "./App";
import CurrentView from "./components/CurrentView";
import HistoricView from "./components/HistoricView";
import Nav from "./components/Nav";
import { mount } from "enzyme";
import getExchangesPositionsResp from "./mocks/getExchangesPositionsResp.json";
import transformExchangeDataResponse from "./mocks/transformExchangeDataResponse.json";
import convertToHistoricDataResponse from "./mocks/convertToHistoricDataResponse.json";
import { BrowserRouter as Router, Route, Switch, MemoryRouter } from "react-router-dom";
import Routes from './routes';
import toJson from "enzyme-to-json";
import { Tab } from "material-ui/Tabs";

const routerIndexes = [
  { pathname: '/', key: 'index' },
  { pathname: '/current', key: 'current' },
  { pathname: '/historic', key: 'historic' },
]

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
  it("should render index properly", () => {
    const wrapper = mount(
      <App />
    );
    expect(wrapper.find(Router).find(Switch).find(Route).find(CurrentView).length).toBe(1);
    expect(wrapper.find(Router).find(Nav).length).toBe(1);
  })

  describe("Nav", () => {
    it("should render index path properly", () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={routerIndexes} initialIndex={0}>
          <Nav />
        </MemoryRouter>
      );
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it("should render /current path properly", () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={routerIndexes} initialIndex={1}>
          <Nav />
        </MemoryRouter>
      );
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it("should render /historic path properly", () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={routerIndexes} initialIndex={2}>
          <Nav />
        </MemoryRouter>
      );
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });

  describe("Loaded data", () => {
    exchange.getExchangesPositions.mockImplementation(() => Promise.resolve(getExchangesPositionsResp));

    describe("CurrentView ", () => {
      dataConverters.convertToCurrentData.mockImplementation(() => transformExchangeDataResponse);

      it("should deep render index properly", () => {
        const wrapper = mount(
          <MemoryRouter initialEntries={routerIndexes} initialIndex={0}>
            <Routes />
          </MemoryRouter>
        );
        expect(toJson(wrapper.find(CurrentView))).toMatchSnapshot();
      });

      it("should deep render /current path properly", () => {
        const wrapper = mount(
          <MemoryRouter initialEntries={routerIndexes} initialIndex={1}>
            <Routes />
          </MemoryRouter>
        );
        expect(toJson(wrapper.find(CurrentView))).toMatchSnapshot();
      });
    });

    describe("HistoricView", () => {
      dataConverters.convertToHistoric.mockImplementation(() => convertToHistoricDataResponse);

      it("should deep render properly after clicking on the Historic tab", () => {
        const wrapper = mount(
          <App />
        );
        wrapper.find(Tab).at(1).find("button").simulate("click");
        expect(toJson(wrapper.find(HistoricView))).toMatchSnapshot();
      });

      it("should deep render /historic path properly", () => {
        const wrapper = mount(
          <MemoryRouter initialEntries={routerIndexes} initialIndex={2}>
            <Routes />
          </MemoryRouter>
        );
        expect(toJson(wrapper.find(HistoricView))).toMatchSnapshot();
      });
    });
  });
});
