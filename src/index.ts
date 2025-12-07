import bootstrap from "./app.controller.ts";

bootstrap();

// async function mainCode() {
//   const gate = makeCompleter();
//   console.log("main code started");
//   const result = promiseCall(gate.resolve);
//   console.log("some cod in between");
//   console.log({ result });

//   await gate.promise;
//   console.log({ result });

//   console.log("main code ended");
// }

// function promiseCall(gateResolve: any) {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       resolve("Done");
//       gateResolve()
//     }, 2000);
//   });
// }
// mainCode();

