/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import mockStore from "../__mocks__/store";
import localStorageMock from "../__mocks__/localStorage";
import userEvent from "@testing-library/user-event";

describe("Given I am connected as an employee", () => {
  const html = NewBillUI();
  document.body.innerHTML = html;

  const onNavigate = (pathname) => {
    document.body.innerHTML = ROUTES({ pathname });
  };

  const myNewBill = new NewBill({
    document,
    onNavigate,
    mockStore,
    localStorage: null,
  });

  describe("When I am on NewBill Page", () => {
    Object.defineProperty(window, "localStorage", { value: localStorageMock });

    // window.localStorage.setItem(
    //   "user",
    //   JSON.stringify({ email: "johndoe@email.com" })
    // );

    test("New Bill form should exist", () => {
      expect(document.querySelector(".form-newbill-container")).toBeTruthy();
    });

    test("New Bill form should have a submit button", () => {
      expect(document.querySelector("#btn-send-bill")).toBeTruthy();
    });

    describe("When we submit a new bill", () => {
      beforeAll(() => {
        screen.getByTestId("expense-type").value = "Transports";
        screen.getByTestId("expense-name").value = "Name";
        screen.getByTestId("datepicker").value = "2021-09-01";
        screen.getByTestId("amount").value = 100;
        screen.getByTestId("vat").value = 10;
        screen.getByTestId("pct").value = 10;
        screen.getByTestId("commentary").value = "Comment";
        screen.getByTestId("file").value = "";
        // Simulate click on submit button
        fireEvent.click(document.querySelector("#btn-send-bill"));
      });

      test("Then the form should be submitted", async () => {
        const form = screen.getByTestId("form-new-bill");
        const handleSubmit = jest.fn((e) => e.preventDefault());

        form.addEventListener("submit", handleSubmit);
        fireEvent.submit(form);
        expect(screen.getByTestId("form-new-bill")).toBeTruthy();
        expect(handleSubmit).toHaveBeenCalled();
      });
    });

    // describe("When I select a file", () => {
    //   test("It should change file value if the file type is wrong", () => {
    //     document.body.innerHTML = NewBillUI();

    //     const onNavigate = (pathname) => {
    //       document.body.innerHTML = ROUTES({ pathname });
    //     };
    //     const myNewBill = new NewBill({
    //       document,
    //       onNavigate,
    //       store: mockStore,
    //       localStorage: null,
    //     });

    //     const spyFile = jest.spyOn(myNewBill, "handleChangeFile");

    //     document
    //       .querySelector(`input[data-testid="file"]`)
    //       .addEventListener("change", spyFile);

    //     const badFile = new File(["hello"], "hello.pdf", {
    //       type: "application/pdf",
    //     });
    //     userEvent.upload(screen.getByTestId("file"), badFile);
    //     expect(screen.getByTestId("file").value).toBe("");
    //     expect(myNewBill.fileUrl).toBe(null);
    //     expect(myNewBill.fileName).toBe(null);
    //   });
    //   test("It should load the  file", () => {
    //     document.body.innerHTML = NewBillUI();

    //     const onNavigate = (pathname) => {
    //       document.body.innerHTML = ROUTES({ pathname });
    //     };
    //     const myNewBill = new NewBill({
    //       document,
    //       onNavigate,
    //       store: mockStore,
    //       localStorage: null,
    //     });

    //     const spyFile = jest.spyOn(myNewBill, "handleChangeFile");

    //     document
    //       .querySelector(`input[data-testid="file"]`)
    //       .addEventListener("change", spyFile);
    //     const file = new File(["hello"], "hello.png", { type: "image/png" });
    //     userEvent.upload(screen.getByTestId("file"), file);
    //     expect(spyFile).toHaveBeenCalled();
    //     expect(screen.getByTestId("file").files[0]).toBe(file);
    //     setTimeout(() => {
    //       expect(myNewBill.fileUrl).toBe("someUrl");
    //       expect(myNewBill.fileName).toBe(
    //         document
    //           .querySelector(`input[data-testid="file"]`)
    //           .value.split(/\\/g).length - 1
    //       );
    //     }, 500);
    //   });
    // });
  });
});
