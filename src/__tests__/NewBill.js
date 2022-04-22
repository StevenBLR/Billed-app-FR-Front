/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import mockStore from "../__mocks__/store";
import localStorageMock from "../__mocks__/localStorage";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then NewBill object should be created", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const myNewBill = new NewBill({
        document,
        onNavigate,
        firestore: mockStore,
        localStorage: localStorageMock,
      });
      expect(myNewBill.document).toBe(document);
      expect(myNewBill.onNavigate).toBe(onNavigate);
      expect(myNewBill.firestore).toBe(null);
      expect(myNewBill.fileUrl).toBe(null);
      expect(myNewBill.fileName).toBe(null);
    });
  });
});
