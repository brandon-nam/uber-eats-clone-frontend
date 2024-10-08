import { useReactiveVar } from "@apollo/client";
import { isLoggedInVar } from "./apollo";
import { LoggedOutRouter } from "./routers/logged-out-router";
import "./styles/styles.css";
import { LoggedInRouter } from "./routers/logged-in-router";
import { Index } from "./pages";

function App() {
    const isLoggedIn = useReactiveVar(isLoggedInVar);

    return (
        <>
            {isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />}
        </>
    );
}

export default App;
