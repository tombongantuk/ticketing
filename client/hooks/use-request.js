import axios from 'axios'
import { useState } from 'react'

const UseRequest = ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null)
    
    const doRequest = async (props={}) => {
        try {
            // const response = await axios[method](url, body);
            setErrors(null)
            const response = await axios({
                method:method,
                url:url,
                data:{...body,...props}
            });
            if (onSuccess) {
                onSuccess(response.data)
            }
            return response.data
        } catch (err) {
            setErrors(
                <div className="alert alert-danger">
                    <h4>Ooopppsss....</h4>
                    <ul className="my-0">
                        {err.response.data.errors.map(err => (
                            <li key={err.message}>{err.message}</li>
                        ))}
                    </ul>
                </div>
            )
        }
    }
    return {doRequest,errors}
}

export default UseRequest