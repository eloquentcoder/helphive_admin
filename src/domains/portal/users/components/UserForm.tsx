import { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  KeyIcon,
  ShieldCheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  useCreateUserMutation, 
  useUpdateUserMutation,
  type User 
} from '../apis/usersApi'

const userValidationSchema = Yup.object({
  name: Yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone: Yup.string(),
  location: Yup.string(),
  role: Yup.string().oneOf(['helper', 'seeker', 'admin']).required('Role is required'),
  status: Yup.string().oneOf(['active', 'pending', 'suspended', 'banned']).required('Status is required'),
  verified: Yup.boolean(),
  password: Yup.string().when('$isEdit', {
    is: false,
    then: (schema) => schema.min(8, 'Password must be at least 8 characters').required('Password is required'),
    otherwise: (schema) => schema
  }),
  skills: Yup.array().of(Yup.string())
})

interface UserFormData {
  name: string
  email: string
  phone?: string
  location?: string
  role: 'helper' | 'seeker' | 'admin'
  status: 'active' | 'pending' | 'suspended' | 'banned'
  verified: boolean
  password?: string
  skills?: string[]
}

interface UserFormProps {
  user?: User
  onSuccess?: () => void
  onCancel?: () => void
  isModal?: boolean
}

export const UserForm = ({ user, onSuccess, onCancel, isModal = false }: UserFormProps) => {
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation()
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()
  const [skillInput, setSkillInput] = useState('')
  const [skills, setSkills] = useState<string[]>(user?.skills || [])

  const isLoading = isCreating || isUpdating
  const isEdit = !!user

  const initialValues: UserFormData = {
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    role: user?.role || 'seeker',
    status: user?.status || 'pending',
    verified: user?.verified || false,
    password: '',
    skills: user?.skills || []
  }

  useEffect(() => {
    if (user) {
      setSkills(user.skills || [])
    }
  }, [user])

  const handleAddSkill = (formikProps: any) => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      const newSkills = [...skills, skillInput.trim()]
      setSkills(newSkills)
      formikProps.setFieldValue('skills', newSkills)
      setSkillInput('')
    }
  }

  const handleRemoveSkill = (skill: string, formikProps: any) => {
    const newSkills = skills.filter(s => s !== skill)
    setSkills(newSkills)
    formikProps.setFieldValue('skills', newSkills)
  }

  const handleSubmit = async (values: UserFormData) => {
    try {
      const formData = {
        ...values,
        skills,
      }

      if (isEdit) {
        // For updates, don't include password if not provided
        const updateData = { 
          id: user.id, 
          ...(values.password ? formData : { ...formData, password: undefined })
        }
        await updateUser(updateData).unwrap()
      } else {
        // For create, password is required
        if (!values.password) {
          throw new Error('Password is required for new users')
        }
        await createUser({ ...formData, password: values.password }).unwrap()
      }
      
      onSuccess?.()
    } catch (error) {
      console.error('Failed to save user:', error)
    }
  }

  const formContent = (
    <Formik
      initialValues={initialValues}
      validationSchema={userValidationSchema}
      validationContext={{ isEdit }}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {(formikProps) => (
        <Form className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Field
                    as={Input}
                    name="name"
                    placeholder="Enter full name"
                    className="pl-10"
                  />
                </div>
                <ErrorMessage name="name" component="p" className="text-sm text-red-600 mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Field
                    as={Input}
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    className="pl-10"
                  />
                </div>
                <ErrorMessage name="email" component="p" className="text-sm text-red-600 mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Field
                    as={Input}
                    name="phone"
                    placeholder="Enter phone number"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Field
                    as={Input}
                    name="location"
                    placeholder="Enter location"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {!isEdit && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Field
                    as={Input}
                    name="password"
                    type="password"
                    placeholder="Enter password (min 8 characters)"
                    className="pl-10"
                  />
                </div>
                <ErrorMessage name="password" component="p" className="text-sm text-red-600 mt-1" />
              </div>
            )}
          </div>

          {/* Role and Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Account Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <Field name="role">
                  {({ field }: any) => (
                    <Select 
                      value={field.value} 
                      onValueChange={(value) => formikProps.setFieldValue('role', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="seeker">Seeker</SelectItem>
                        <SelectItem value="helper">Helper</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </Field>
                <ErrorMessage name="role" component="p" className="text-sm text-red-600 mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <Field name="status">
                  {({ field }: any) => (
                    <Select 
                      value={field.value} 
                      onValueChange={(value) => formikProps.setFieldValue('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select user status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                        <SelectItem value="banned">Banned</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </Field>
                <ErrorMessage name="status" component="p" className="text-sm text-red-600 mt-1" />
              </div>
            </div>

            <Field name="verified">
              {({ field }: any) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="verified"
                    checked={field.value}
                    onCheckedChange={(checked) => formikProps.setFieldValue('verified', checked)}
                  />
                  <label
                    htmlFor="verified"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Account Verified
                  </label>
                  {field.value && (
                    <ShieldCheckIcon className="h-4 w-4 text-green-600" />
                  )}
                </div>
              )}
            </Field>
          </div>

          {/* Skills (for helpers/providers) */}
          {(formikProps.values.role === 'helper') && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Skills/Services</h3>
              
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add a skill"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddSkill(formikProps)
                      }
                    }}
                  />
                  <Button type="button" onClick={() => handleAddSkill(formikProps)}>
                    Add
                  </Button>
                </div>
                
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="pr-1">
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill, formikProps)}
                          className="ml-2 hover:text-red-600"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || formikProps.isSubmitting}>
              {isLoading ? 'Saving...' : isEdit ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  )

  if (isModal) {
    return (
      <Dialog open={true} onOpenChange={() => onCancel?.()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit User' : 'Create New User'}</DialogTitle>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit User' : 'Create New User'}</CardTitle>
      </CardHeader>
      <CardContent>
        {formContent}
      </CardContent>
    </Card>
  )
}