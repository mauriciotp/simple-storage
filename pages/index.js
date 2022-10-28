import { useEffect, useState } from "react";
import Web3 from "web3";
import { loadContract } from "../utils/loadContract";

export default function Home() {
  const [web3Api, setWeb3Api] = useState({
    web3: null,
    contract: null,
    accounts: null,
  });
  const [inputData, setInputData] = useState(0);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const web3 = new Web3("http://localhost:9545");
      const contract = await loadContract("SimpleStorage", web3);
      const accounts = await web3.eth.getAccounts();
      setWeb3Api({
        web3,
        contract,
        accounts,
      });
    }

    fetchData();
  }, []);

  async function onSubmit() {
    const { contract, accounts } = web3Api;
    await contract.methods.set(inputData).send({ from: accounts[0] });
    const data = await getData(contract);
    setData(data);
  }

  async function getData(contract) {
    const data = await contract.methods.get().call();
    return data;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="font-bold text-5xl mb-4">Simple storage</h1>
      <form className="mb-3" onSubmit={(event) => event.preventDefault()}>
        <div className="flex flex-col gap-3 mb-3">
          <label htmlFor="data">Set data (number)</label>
          <input
            onChange={({ target: { value } }) => setInputData(value)}
            value={inputData}
            className="py-2 px-4 border border-gray-600 rounded-md"
            type="number"
            id="data"
          />
        </div>
        <button
          onClick={onSubmit}
          className="bg-indigo-600 text-white rounded-md py-2 px-4"
        >
          Submit
        </button>
      </form>
      <div>Data: {data}</div>
    </div>
  );
}
