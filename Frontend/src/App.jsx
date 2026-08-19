function App()
{
    return (
        <div className="container mx-auto max-w-4xl pb-44">
          <div className="m-6 p-3 bg-neutral-800 rounded-xl ml-auto ml-0 max-w-fit">
            Hi ,how are you?
          </div>
          <div className="m-6 p-3 bg-blue-600 rounded-xl mr-auto mr-0 max-w-fit">
            I'm doing well, thank you for asking!
          </div>
          <div class ="fixed inset-x-0 bottom-0 flex items-center justify-center p-4">
          <div className="bg-neutral-800 p-4 rounded-xl w-full max-w-4xl">
              <textarea className="w-full resize-none outline-none " name="" id="input" placeholder="Type your message here..."></textarea>
              <div className="flex justify-end ">
                <button className="bg-white text-black px-4 py-1 rounded-full cursor pointer hover:bg-gray-300">Send</button>
              </div>
          </div>
          </div>
        </div>
    );
}
export default App;