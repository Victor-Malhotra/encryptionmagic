import React, { useState } from 'react';

const App = () => {
  const [message, setMessage] = useState('');
  const [hash, setHash] = useState('');
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState('');
  const [activeTab, setActiveTab] = useState('shift');
  const [encryptionOrder, setEncryptionOrder] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleEncrypt = (e) => {
    e.preventDefault();
    let result = message;
    const selectedEncryptionOrder = encryptionOrder.length > 0 ? encryptionOrder : [activeTab];

    try {
      selectedEncryptionOrder.forEach((encryptionMethod) => {
        switch (encryptionMethod) {
          case 'shift':
            result = shiftStringByHash(result, hash);
            break;
          case 'hexadecimal':
            result = convertToHexadecimal(result);
            break;
          case 'binary':
            result = convertToBinary(result);
            break;
          case 'octal':
            result = convertToOctal(result);
            break;
          default:
            throw new Error(`Invalid encryption method: ${encryptionMethod}`);
        }
      });

      setEncryptedMessage(result);
      setDecryptedMessage('');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message);
      setEncryptedMessage('');
      setDecryptedMessage('');
    }
  };

  const handleDecrypt = (e) => {
    e.preventDefault();
    let result = encryptedMessage;
    const selectedEncryptionOrder = encryptionOrder.length > 0 ? encryptionOrder.reverse() : [activeTab];

    try {
      selectedEncryptionOrder.forEach((encryptionMethod) => {
        switch (encryptionMethod) {
          case 'shift':
            result = decryptStringByHash(result, hash);
            break;
          case 'hexadecimal':
            result = convertFromHexadecimal(result);
            break;
          case 'binary':
            result = convertFromBinary(result);
            break;
          case 'octal':
            result = convertFromOctal(result);
            break;
          default:
            throw new Error(`Invalid encryption method: ${encryptionMethod}`);
        }
      });

      setDecryptedMessage(result);
      setEncryptedMessage('');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message);
      setDecryptedMessage('');
      setEncryptedMessage('');
    }
  };

  const shiftStringByHash = (inputString, hash) => {
    if (inputString.length === 0) {
      return '';
    }

    const normalizedHash = normalizeHash(hash);
    let shiftedString = '';

    for (let i = 0; i < inputString.length; i++) {
      const charCode = inputString.charCodeAt(i);
      let shiftedCharCode;

      if (charCode >= 97 && charCode <= 122) { // Check if the character is lowercase letter (a-z)
        const adjustedHash = normalizedHash[i % normalizedHash.length];
        shiftedCharCode = ((charCode - 97 + adjustedHash + 26) % 26) + 97;
      } else {
        shiftedCharCode = charCode; // Preserve non-alphabet characters as is
      }

      const shiftedChar = String.fromCharCode(shiftedCharCode);
      shiftedString += shiftedChar;
    }

    return shiftedString;
  };

  const decryptStringByHash = (inputString, hash) => {
    if (inputString.length === 0) {
      return '';
    }

    const normalizedHash = normalizeHash(hash);
    let decryptedString = '';

    for (let i = 0; i < inputString.length; i++) {
      const charCode = inputString.charCodeAt(i);
      let decryptedCharCode;

      if (charCode >= 97 && charCode <= 122) { // Check if the character is lowercase letter (a-z)
        const adjustedHash = normalizedHash[i % normalizedHash.length];
        decryptedCharCode = ((charCode - 97 - adjustedHash + 26) % 26) + 97;
      } else {
        decryptedCharCode = charCode; // Preserve non-alphabet characters as is
      }

      const decryptedChar = String.fromCharCode(decryptedCharCode);
      decryptedString += decryptedChar;
    }

    return decryptedString;
  };

  const normalizeHash = (hash) => {
    const normalizedHash = [];

    for (let i = 0; i < hash.length; i++) {
      const charCode = hash.charCodeAt(i);

      if (charCode >= 65 && charCode <= 90) { // Check if the character is uppercase letter (A-Z)
        normalizedHash.push(charCode - 65);
      } else if (charCode >= 48 && charCode <= 57) { // Check if the character is a digit (0-9)
        normalizedHash.push(charCode - 48);
      } else {
        throw new Error('Invalid hash. Only alphanumeric characters are allowed.');
      }
    }

    return normalizedHash;
  };

  const convertToHexadecimal = (inputString) => {
    let hexadecimalString = '';

    for (let i = 0; i < inputString.length; i++) {
      const charCode = inputString.charCodeAt(i);
      const hexadecimalChar = charCode.toString(16);
      hexadecimalString += hexadecimalChar;
    }

    return hexadecimalString;
  };

  const convertFromHexadecimal = (hexadecimalString) => {
    let result = '';

    for (let i = 0; i < hexadecimalString.length; i += 2) {
      const hexChar = hexadecimalString.substr(i, 2);
      const charCode = parseInt(hexChar, 16);
      const char = String.fromCharCode(charCode);
      result += char;
    }

    return result;
  };

  const convertToBinary = (inputString) => {
    let binaryString = '';

    for (let i = 0; i < inputString.length; i++) {
      const charCode = inputString.charCodeAt(i);
      const binaryChar = charCode.toString(2);
      binaryString += binaryChar.padStart(8, '0');
    }

    return binaryString;
  };

  const convertFromBinary = (binaryString) => {
    let result = '';

    for (let i = 0; i < binaryString.length; i += 8) {
      const binaryChar = binaryString.substr(i, 8);
      const charCode = parseInt(binaryChar, 2);
      const char = String.fromCharCode(charCode);
      result += char;
    }

    return result;
  };

  const convertToOctal = (inputString) => {
    let octalString = '';

    for (let i = 0; i < inputString.length; i++) {
      const charCode = inputString.charCodeAt(i);
      const octalChar = charCode.toString(8);
      octalString += octalChar;
    }

    return octalString;
  };

  const convertFromOctal = (octalString) => {
    let result = '';

    for (let i = 0; i < octalString.length; i += 3) {
      const octalChar = octalString.substr(i, 3);
      const charCode = parseInt(octalChar, 8);
      const char = String.fromCharCode(charCode);
      result += char;
    }

    return result;
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setEncryptionOrder([]);
    setErrorMessage('');
    setEncryptedMessage('');
    setDecryptedMessage('');
  };

  const handleEncryptionOrderChange = (e) => {
    const selectedEncryptionOrder = Array.from(e.target.selectedOptions, (option) => option.value);
    setEncryptionOrder(selectedEncryptionOrder);
    setErrorMessage('');
    setEncryptedMessage('');
    setDecryptedMessage('');
  };

  return (
    <div className=' flex justify-center h-screen m-auto w-[32rem]'>
    <div className="flex justify-center h-screen w-[32rem]  border-2 border-black rounded-3xl ">
      <div className=" rounded-lg  p-6 ">
        <h1 className="text-3xl font-bold mb-4 text-center">MAGIC 3CRYPT</h1>
        <div className="mb-4">
          <ul className="flex justify-center space-x-4">
            <li
              className={`cursor-pointer p-2 ${activeTab === 'shift' ? 'text-blue-500 underline bg-slate-700 rounded-md' : 'bg-slate-300 text-gray-500 rounded-md'}`}
              onClick={() => handleTabChange('shift')}
            >
              Shift
            </li>
            <li
              className={`cursor-pointer p-2 ${activeTab === 'hexadecimal' ? 'text-blue-500 underline bg-slate-700 rounded-md' : 'bg-slate-300 text-gray-900 rounded-md'}`}
              onClick={() => handleTabChange('hexadecimal')}
            >
              Hexadecimal
            </li>
            <li
              className={`cursor-pointer p-2 ${activeTab === 'binary' ? 'text-blue-500 underline bg-slate-700 rounded-md' : 'bg-slate-300 text-gray-900 rounded-md'}`}
              onClick={() => handleTabChange('binary')}
            >
              Binary
            </li>
            <li
              className={`cursor-pointer p-2 ${activeTab === 'octal' ? 'text-blue-500 underline bg-slate-700 rounded-md' : 'bg-slate-300 text-gray-900 rounded-md'}`}
              onClick={() => handleTabChange('octal')}
            >
              Octal
            </li>
            <li
              className={`cursor-pointer p-2 ${activeTab === 'custom' ? 'text-blue-500 underline bg-slate-700 rounded-md' : 'bg-slate-300 text-gray-900 rounded-md'}`}
              onClick={() => handleTabChange('custom')}
            >
              Custom
            </li>
          </ul>
        </div>
        {activeTab === 'custom' && (
          <div className="mb-4">
            <label htmlFor="encryptionOrder" className="block mb-1 font-medium">Encryption Order:</label>
            <select
              id="encryptionOrder"
              multiple
              value={encryptionOrder}
              onChange={handleEncryptionOrderChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="shift">Shift</option>
              <option value="hexadecimal">Hexadecimal</option>
              <option value="binary">Binary</option>
              <option value="octal">Octal</option>
            </select>
          </div>
        )}
        <form>
          <div className="mb-4">
            <label htmlFor="message" className="block mb-1 font-medium">Message:</label>
            <input
              type="text"
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border border-black rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="hash" className="block mb-1 font-medium">Hash:</label>
            <input
              type="text"
              id="hash"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              className="w-full p-2 border border-black rounded-md"
            />
          </div>
          <div className="mb-4 flex flex-row items-center justify-center">
            <button
              onClick={handleEncrypt}
              className="px-4 py-2 bg-blue-500 text-white rounded-md mr-10"
            >
              Encrypt
            </button>
            <button
              onClick={handleDecrypt}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Decrypt
            </button>
          </div>
        </form>
        {encryptedMessage && (
          <div className="mb-4">
            <label htmlFor="encryptedMessage" className="block mb-1 font-medium">Encrypted Message:</label>
            <textarea
              id="encryptedMessage"
              value={encryptedMessage}
              readOnly
              className="w-full p-2 border border-black rounded-md"
            />
          </div>
        )}
        {decryptedMessage && (
          <div className="mb-4">
            <label htmlFor="decryptedMessage" className="block mb-1 font-medium">Decrypted Message:</label>
            <textarea
              id="decryptedMessage"
              value={decryptedMessage}
              readOnly
              className="w-full p-2 border border-black rounded-md"
            />
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 text-red-500">
            <p>{errorMessage}</p>
          </div>
        )}
      </div>
      </div>
      </div>
  );
};

export default App;