export default function Footer() {
  return (
    <footer className="bg-slate-800 text-white py-4">
      <div className="px-16 py-4 container mx-auto">
        <p className="text-lg font-semibold mb-2">Need Assistance?</p>
        <p className="mb-2">For help, you can reach out to our support team:</p>
        <div className="my-4">
          <p className="font-semibold mb-4">📞 Phone Contacts:</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p>Sahan: +94 70 341 3298</p>
              <p>Sachith: +94 71 887 9480</p>
              <p>Anuka: +94 71 772 0214</p>
            </div>
            <div>
              <p>Umair: +94 77 494 7906</p>
              <p>Udara: +94 77 126 0427</p>
            </div>
            <div>
              <p>Susara: +94 76 485 8102</p>
              <p>Vimansa: +94 71 230 4489</p>
            </div>
          </div>
        </div>
        <p className="mb-4">
          <span className="font-semibold">📧 Email:</span> vqueue.mgt@gmail.com
        </p>
        <p className="text-sm w-full text-center text-slate-400 mt-5">
          &copy; {new Date().getFullYear()} Industry Day 2024, Faculty of
          Science, University of Peradeniya. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
