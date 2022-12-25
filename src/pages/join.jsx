import { useNavigate } from "react-router"

export function Error() {
   const navigate = useNavigate()

   const linkConfirm = ()=>{
         console.log('fffff')
   }

    return (
        <div className='join'>
            <h1>join an event</h1>
            <p>Here you can enter the URL to join an existing event.</p>
            <form onSubmit={linkConfirm}>
                <input type='text'/>
                <button>Connect</button>
            </form>
        </div>
    )
}