import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { MessageCircle, Send, Upload } from 'lucide-react'
import { SendToManyForm } from '../../../components/sms/send-to-many-form'
import { SendToOneForm } from '../../../components/sms/send-to-one-form'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/(private)/sms-sender/')({
  component: SendSmsPage,
})

function SendSmsPage() {
  const [activeMode, setActiveMode] = useState<'single' | 'bulk'>('single')

  return (
    <div className="min-h-screen dark:from-slate-950 dark:to-slate-900 py-8 px-4">
      <div className="max-w-6xl ">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Send SMS
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Send SMS messages to customers individually or in bulk
          </p>
        </div>

        {/* Main Layout: Sidebar + Content */}
        <div className="flex flex-col xl:flex-row gap-6">
          <div className="w-full xl:w-64 shrink-0">
            <div className="space-y-3">
              <Button
                onClick={() => setActiveMode('single')}
                variant={activeMode === 'single' ? 'default' : 'outline'}
                className="w-full justify-start gap-3 h-auto py-4 px-4 text-left"
              >
                <Send className="w-5 h-5 shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold">Send to One</div>
                  <div className="text-xs opacity-75">Single recipient</div>
                </div>
              </Button>

              <Button
                onClick={() => setActiveMode('bulk')}
                variant={activeMode === 'bulk' ? 'default' : 'outline'}
                className="w-full justify-start gap-3 h-auto py-4 px-4 text-left"
              >
                <Upload className="w-5 h-5 shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold">Send to Many</div>
                  <div className="text-xs opacity-75">Bulk via CSV</div>
                </div>
              </Button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-900">
              <CardContent className="pt-8">
                {activeMode === 'single' ? (
                  <SendToOneForm />
                ) : (
                  <SendToManyForm />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
