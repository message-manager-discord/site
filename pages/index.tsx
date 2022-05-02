import Code from "../components/icons/code";
import Collection from "../components/icons/collection";
import Gear from "../components/icons/gear";
import Info from "../components/icons/info";

export default function Page() {
  return (
    <div className="container mx-auto px-10">
      <div className="grow">
        <div className="mb-2 md:mb-8 text-center">
          <h2 className="text-2xl md:text-3xl text-indigo-600 dark:text-indigo-200 font-semibold tracking-wide uppercase">
            Message Manager
          </h2>
          <p className="mt-2 text-xl leading-8 tracking-tight text-slate-800 dark:text-white md:text-2xl">
            Making managing messages easier
          </p>
        </div>
        <div className="flex flex-wrap my-0 md:my-12 dark:text-white ">
          <div className="w-full border-b border-slate-300 md:w-1/2 md:border-r  p-8">
            <div className="flex items-center mb-6">
              <Info
                width="20"
                height="20"
                className="h-6 w-6 text-indigo-500 dark:text-indigo-300"
              />
              <div className="ml-4 text-xl">About</div>
            </div>
            <p className="leading-loose text-slate-500 dark:text-slate-200 text-md">
              Message Manager is designed to make the management of important
              messages in servers easier, allowing the editing of a single
              message by more than one staff member.
            </p>
          </div>
          <div className="w-full border-b border-slate-300 md:w-1/2 p-8">
            <div className="flex items-center mb-6">
              <Collection
                width="20"
                height="20"
                className="h-6 w-6 text-indigo-500 dark:text-indigo-300"
              />
              <div className="ml-4 text-xl">Features</div>
            </div>
            <ul className="list-disc list-inside leading-loose text-slate-500 dark:text-slate-200 text-md">
              <li>Message management (editing and sending)</li>
              <li>Customizable prefix and server settings</li>
            </ul>
          </div>
          <div className="w-full border-b border-slate-300 md:w-1/2 md:border-r md:border-b-0 p-8">
            <div className="flex items-center mb-6">
              <Gear
                width="20"
                height="20"
                className="h-6 w-6 text-indigo-500 dark:text-indigo-300"
              />
              <div className="ml-4 text-xl">Setup</div>
            </div>
            <ol className="list-decimal list-inside leading-loose text-slate-500 dark:text-slate-200 text-md">
              <li>Invite the bot to your server</li>
              <li>
                Setup the prefix with <code>~setup prefix</code>
              </li>
              <li>Then setup the rest of the configuration. </li>
            </ol>
          </div>
          <div className="w-full md:w-1/2  p-8">
            <div className="flex items-center mb-6">
              <Code
                width="20"
                height="20"
                className="h-6 w-6 text-indigo-500 dark:text-indigo-300"
              />
              <div className="ml-4 text-xl">Contributing</div>
            </div>
            <p className="leading-loose text-slate-500 dark:text-slate-200 text-md">
              Open source code can be found on the{" "}
              <a
                href="https://github.com/orgs/message-manager-discord"
                rel="noreferrer"
                target="_blank"
                className="border-b transition duration-300 ease-in-out hover:text-blue-500 dark:hover:text-blue-300"
              >
                github organization.
              </a>
              <br />
              Github issues (on the relevant repository) and the support server
              can be used to raise issues or feature requests, and pull requests
              are always welcome.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
