/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import mockStore from "../__mocks__/store";
import localStorageMock from "../__mocks__/localStorage";
import userEvent from "@testing-library/user-event";
import { ROUTES } from "../constants/routes";

describe("Given I am connected as an employee", () => {
  const html = NewBillUI();
  document.body.innerHTML = html;

  describe("When I am on NewBill Page", () => {
    test("New Bill form should exist", () => {
      expect(document.querySelector(".form-newbill-container")).toBeTruthy();
    });

    test("New Bill form should have a submit button", () => {
      expect(document.querySelector("#btn-send-bill")).toBeTruthy();
    });

    describe("When I do fill correctly the fields and I click on submit button", () => {
      test("It should renders Bills page", () => {
        document.body.innerHTML = NewBillUI();
        const inputData = {
          expenseType: "Transports",
          expenseAmount: "100",
          expenseDate: "2020-01-01",
          commentary: "Test",
          vat: "20",
          pct: "10",
          file: "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
        };

        // Add inputs to form
        const inputExpenseType = screen.getByTestId("expense-type");
        fireEvent.change(inputExpenseType, {
          target: { value: inputData.expenseType },
        });
        expect(inputExpenseType.value).toBe(inputData.expenseType);

        const inputExpenseAmount = screen.getByTestId("amount");
        fireEvent.change(inputExpenseAmount, {
          target: { value: inputData.expenseAmount },
        });
        expect(inputExpenseAmount.value).toBe(inputData.expenseAmount);

        const inputExpenseDate = screen.getByTestId("datepicker");
        fireEvent.change(inputExpenseDate, {
          target: { value: inputData.expenseDate },
        });
        expect(inputExpenseDate.value).toBe(inputData.expenseDate);

        const inputCommentary = screen.getByTestId("commentary");
        fireEvent.change(inputCommentary, {
          target: { value: inputData.commentary },
        });
        expect(inputCommentary.value).toBe(inputData.commentary);

        const inputVat = screen.getByTestId("vat");
        fireEvent.change(inputVat, { target: { value: inputData.vat } });
        expect(inputVat.value).toBe(inputData.vat);

        const inputPtc = screen.getByTestId("pct");
        fireEvent.change(inputPtc, { target: { value: inputData.pct } });
        expect(inputPtc.value).toBe(inputData.pct);

        const inputFile = screen.getByTestId("file");
        fireEvent.change(inputFile, { target: { value: "" } });
        //expect(inputFile.value).toBe(inputData.file);

        const form = screen.getByTestId("form-new-bill");

        // Edit localStorage
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
            email: "employee@test.tld",
            status: "connected",
            password: "employee",
          })
        );

        // Mocking navigation
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        const newBills = new NewBill({
          document,
          onNavigate,
          mockStore,
          localStorage: window.localStorage,
        });

        // Mock handleSubmit and check if it is called
        const handleSubmit = jest.fn(newBills.handleSubmit);
        newBills.handleSubmit = jest.fn().mockResolvedValue({});
        form.addEventListener("submit", handleSubmit);
        fireEvent.submit(form);
        expect(handleSubmit).toHaveBeenCalled();
      });
    });

    describe("When I change file input", () => {
      test("It should reset file value if the file type is wrong", () => {
        document.body.innerHTML = NewBillUI();

        // Mock navigation
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        const myNewBill = new NewBill({
          document,
          onNavigate,
          mockStore,
          localStorage: window.localStorage,
        });

        const spyFile = jest.spyOn(myNewBill, "handleChangeFile");

        document
          .querySelector(`input[data-testid="file"]`)
          .addEventListener("change", spyFile);

        const badFile = new File(["hello"], "hello.pdf", {
          type: "application/pdf",
        });
        userEvent.upload(screen.getByTestId("file"), badFile);
        expect(screen.getByTestId("file").value).toBe("");
        expect(myNewBill.fileUrl).toBe(null);
        expect(myNewBill.fileName).toBe(null);
      });
    });
    test("It should load the file", () => {
      document.body.innerHTML = NewBillUI();

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const myNewBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      const spyFile = jest.spyOn(myNewBill, "handleChangeFile");

      document
        .querySelector(`input[data-testid="file"]`)
        .addEventListener("change", spyFile);
      console.log("Store ---------->", myNewBill.store);
      const file = new File(["hello"], "hello.png", { type: "image/png" });
      userEvent.upload(screen.getByTestId("file"), file);
      expect(spyFile).toHaveBeenCalled();
      expect(screen.getByTestId("file").files[0]).toBe(file);
    });
  });
});
