import { useForm, useFieldArray } from "react-hook-form"
import { DevTool } from "@hookform/devtools"
import { useEffect } from "react";

let renderCount = 0;

type FormValues = {
  username: string,
  email: string,
  channel: string,
  social: {
    twitter: string,
    facebook: string,
  },
  phones: string[],
  phnNumbers: {
    number: string,
  }[],
  age: number,
  dob: Date,
}

const YouTubeForm = () => {

  const form = useForm<FormValues>({
    defaultValues: {
      username: '',
      email: '',
      channel: ``,
      social: {
        twitter: '',
        facebook: '',
      },
      phones: [' ', ' '],
      phnNumbers: [{ number: '' }],
      age: 0,
      dob: new Date(),
    }
  }
  );
  const { register, control, handleSubmit, formState, watch, getValues, setValue } = form;
  const { errors } = formState;

  useEffect(() => {
    const subscription = watch((value) => {
      console.log(value);
    })
    return () => subscription.unsubscribe();
  }, [watch]);

  // const watchedValue = watch()

  const { fields, append, remove } = useFieldArray({
    name: 'phnNumbers',
    control
  })

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted', data);

  }

  const handleGetValues = () => {
    console.log('Get values', getValues());
  }

  const handleSetValues = () => {
    setValue('username', '', {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  renderCount++
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <h1>YouTube Form ({renderCount / 2})</h1>
        {/* <h2>Watched value: {JSON.stringify(watch)}</h2> */}
        <label htmlFor="userName" >UserName</label>
        <input type="text" id='userName' {...register("username", {
          required: {
            value: true,
            message: 'UserName is required'
          }
        })} />

        <p>{errors.username?.message}</p>

        <label htmlFor="email">E-mail</label>
        <input type="email" id='email' {...register('email', {
          required: {
            value: true,
            message: 'Please enter your email address'
          },
          pattern: {
            value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            message: 'Invalid email format'
          },
          validate: {
            notAdmin: (fieldValue) => {
              return (
                fieldValue !== `admin@example.com` ||
                `Enter a different email address`
              )
            },
            notBlacklisted: (fieldValue) => {
              return (
                !fieldValue.endsWith(`baddomain.com`) ||
                `This domain is not supported`
              )
            },
          }
        })} />

        <p>{errors.email?.message}</p>

        <label htmlFor="channel">Channel</label>
        <input type="text" id='channel' {...register('channel', {
          required: {
            value: true,
            message: 'Channel is required'
          }
        })} />

        <p>{errors.channel?.message}</p>

        <label htmlFor="twitter">Twitter</label>
        <input type="text" id='twitter' {...register('social.twitter', {
          disabled: watch('channel') == '',
        })} />

        <p>{errors.social?.twitter?.message}</p>

        <label htmlFor="facebook">Facebook</label>
        <input type="text" id='facebook' {...register('social.facebook', {
          required: {
            value: true,
            message: `Facebook is required`
          }
        })} />

        <p>{errors.social?.facebook?.message}</p>

        <label htmlFor="phones">Phone</label>
        <input
          type="tel"
          id="phones"
          {...register('phones.0', {
            required: 'Phone is required',
          })}
        />
        <p>{errors.phones?.[0]?.message}</p>

        <label htmlFor="secondaryPhone">Secondary Phone</label>
        <input
          type="tel"
          id="phones.1"
          {...register('phones.1', {
            required: 'Secondary Phone is required',
          })}
        />
        <p>{errors.phones?.[1]?.message}</p>

        <div>
          <label>List of phone numbers</label>
          <div>
            {fields.map((field, index) => {

              return (
                <div className="form-control" key={field.id} >
                  <input type="text" {...register(`phnNumbers.${index}.number` as const)} />
                  {
                    index > 0 && (
                      <button type="button" onClick={() => remove(index)} >Remove</button>
                    )
                  }
                </div>
              )
            })}
            <button type="button" onClick={() => append({ number: "" })} >Add phone number</button>
          </div>
        </div>

        <label htmlFor="age">Age</label>
        <input type="number" id='age' {...register('age', {
          valueAsNumber: true,
          required: {
            value: true,
            message: 'Age is required'
          }
        })} />

        <p>{errors.age?.message}</p>

        <label htmlFor="dob">dob</label>
        <input type="date" id='dob' {...register('dob', {
          valueAsDate: true,
          required: {
            value: true,
            message: 'Date of birth is required'
          }
        })} />

        <p>{errors.dob?.message}</p>

        <button type="button" onClick={handleGetValues}>Get Values</button>
        <button type="button" onClick={handleSetValues}>Set Values</button>

        <button type='submit'>Submit</button>

      </form>
      <DevTool control={control} />
    </div>
  )
}

export default YouTubeForm