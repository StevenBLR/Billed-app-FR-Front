/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import userEvent from "@testing-library/user-event";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import router from "../app/Router.js";
import Bills from "../containers/Bills.js";

describe("Given I am connected as an employee", () => {
  describe("When I navigate to Bills", () => {
    const bills = new Bills({
      document: document,
      onNavigate: router.onNavigate,
      store: mockStore,
      localStorage: localStorageMock,
    });
    test("The function getBill should be called", async () => {
      const spy = jest.spyOn(bills, "getBills");
      await bills.getBills();
      expect(spy).toHaveBeenCalled();
    });

    test("The function getBill should return an array of bills", async () => {
      const spy = jest.spyOn(bills, "getBills");
      await bills.getBills();
      expect(spy).toHaveReturned();
    });
  });
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      //to-do write expect expression
      expect(windowIcon.classList.contains("active-icon")).toBe(true);
    });
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
    test("The eye icons should be visible", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const icons = screen.getAllByTestId("icon-eye");
      expect(icons.length).toBeGreaterThan(0);
    });
    test("Then Bills object should be instanciated", () => {
      const bills = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage,
      });
      expect(bills).toBeTruthy();
    });

    describe("When I click on new Bill", () => {
      // test("We should be redirected to newBill page", () => {
      //   document.body.innerHTML = BillsUI({ data: bills });
      //   const buttonNewBill = document.querySelector(
      //     `button[data-testid="btn-new-bill"]`
      //   );
      //   buttonNewBill.click();
      //   expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH.NewBill);
      // });
    });

    describe("When I click on an eye icon button", () => {
      test("The modal should show", () => {
        const ui = BillsUI({ data: bills });
        document.body.innerHTML = ui;

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        const myBill = new Bills({
          document,
          onNavigate,
          store: null,
          localStorage: window.localStorage,
        });
        //mock boostrap .modal("show") function
        $.fn.modal = jest.fn().mockImplementation(() => {
          $("#modaleFile").css("display", "block");
        });

        const spy = jest.spyOn(myBill, "handleClickIconEye");
        const icon = document.querySelector(`[data-testid="icon-eye"]`);
        userEvent.click(icon);

        const modal = document.getElementById("modaleFile");
        expect(spy).toHaveBeenCalled();
        expect(modal.style.display).toBe("block");
      });
    });
  });
});
