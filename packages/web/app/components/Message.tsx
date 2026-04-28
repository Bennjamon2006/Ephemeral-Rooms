type Props = {
  content: string;
  username: string;
  itsMe: boolean;
};

export default function Message({ content, username, itsMe }: Props) {
  return (
    <div className={`flex ${itsMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xl px-4 py-2 rounded ${
          itsMe ? "bg-blue-600" : "bg-gray-800"
        }`}
      >
        {!itsMe && (
          <>
            <span className="text-indigo-400 font-medium">{username}</span>
            :{" "}
          </>
        )}
        {content}
      </div>
    </div>
  );
}
