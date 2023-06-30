import './index.css';

const App=() => {
  return (
    <div>
      <form>
        <div className='flex flex-col'>
          <label htmlFor='hash'>Hash #: </label> <input type="number" name="hash" id="hash" />
          <label htmlFor='message'>Message: </label> <textarea name='message' id='message'></textarea>
        </div>
        <button>Encrypt</button> <button>Decrypt</button>
      </form>
      <div className='' id='result'></div>
    </div>
  );
}

export default App;