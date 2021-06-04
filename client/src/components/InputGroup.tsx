import classNames from 'classnames'

interface InputGroupProps {
    className?: string
    type: string
    placeholder: string
    value: string
    errLength: number
    error: string | undefined
    setValue: (str: string) => void
}

const InputGroup: React.FC<InputGroupProps> = ({
    className, type, placeholder, value, error, setValue, errLength
}) => {
    return <div className={className}>
        <input type={type} 
        value={value} 
        onChange={e => {
            setValue(e.target.value)
            if(e.target.value.length > errLength){
                error = ''
            }
        }} 
        className={classNames("w-full px-3 py-3 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white", {"border-red-700": error})}
        placeholder={placeholder}/>
        <small className="font-medium text-red-700">{error}</small>
    </div>
}

export default InputGroup