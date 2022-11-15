export function Register(){
    return <section className="register">
        <h1>Create a Nickname</h1>
        <form>
            <h3>Nickname</h3>
            <input type="text" placeholder="Enter your nickname"/>
            <h3>Image</h3>
            <label htmlFor='img'>sdfsdfsdf</label>
            <input id='img' className="non-appear" type="file" placeholder="Upload your image" accept="image/*"/>
        </form>
        </section>
}