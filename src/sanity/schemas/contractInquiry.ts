import { defineType, defineField } from 'sanity'

export const contractInquiry = defineType({
  name: 'contractInquiry',
  title: 'Contract Publishing Inquiry',
  type: 'document',
  fields: [
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'workEmail',
      title: 'Work Email',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'country',
      title: 'Country/Region',
      type: 'string',
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
    }),
    defineField({
      name: 'agreeToCommunications',
      title: 'Agreed to Communications',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Contacted', value: 'contacted' },
          { title: 'Quoted', value: 'quoted' },
          { title: 'Closed', value: 'closed' },
        ],
        layout: 'radio',
      },
      initialValue: 'new',
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      description: 'Internal notes about this inquiry',
    }),
  ],
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      company: 'companyName',
      email: 'workEmail',
      status: 'status',
      submittedAt: 'submittedAt',
    },
    prepare({ firstName, lastName, company, email, status, submittedAt }) {
      const name = `${firstName || ''} ${lastName || ''}`.trim() || 'Unknown'
      const date = submittedAt ? new Date(submittedAt).toLocaleDateString() : ''
      return {
        title: `${name} - ${company || 'No Company'}`,
        subtitle: `${email || 'No Email'} | ${status || 'new'} | ${date}`,
      }
    },
  },
  orderings: [
    {
      title: 'Submitted Date (Newest)',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
    {
      title: 'Submitted Date (Oldest)',
      name: 'submittedAtAsc',
      by: [{ field: 'submittedAt', direction: 'asc' }],
    },
    {
      title: 'Status',
      name: 'statusAsc',
      by: [{ field: 'status', direction: 'asc' }],
    },
  ],
})

