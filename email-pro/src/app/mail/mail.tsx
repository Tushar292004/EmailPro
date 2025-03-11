'use client'

import React from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { TooltipProvider } from '@/components/ui/tooltip';
import { number } from 'zod';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { TabsContent } from '@radix-ui/react-tabs';
import AccountSwitcher   from './account-switcher';
import { Sidebar } from 'lucide-react';
import { ThreadList } from './components/thread-list';
import { ThreadDisplay } from './components/thread-display';

type Props = {
    defaultLayout: number[] | undefined
    navCollapsedSize: number
    defaultCollapsed: boolean

}

 const Mail = ({ defaultLayout = [20, 32, 48,], navCollapsedSize, defaultCollapsed }: Props) => {

  const [isCollapsed, setIsCollapsed] = React.useState(false);
  return (
     <TooltipProvider delayDuration={0}>
        <ResizablePanelGroup direction='horizontal' onLayout={(size: number[]) => {
            console.log(size);
        }} className='items-stretch h-full min-h-screen'>
            <ResizablePanel defaultSize={defaultLayout[0]} collapsedSize={navCollapsedSize}
            collapsible={true}
            minSize={15}
            maxSize={40}
            onCollapse={() => { 
                setIsCollapsed(true);
            }}
            onResize={()=>{
                setIsCollapsed(false);

            }}
            className={cn(isCollapsed && 'min-w-[50px] translat-all duration-300 ease-in-out')}
            >
                <div className='flex flex-col h-full flex-1'>
                    <div className={cn('flex h-[52px] items-center justify-between', isCollapsed ? 'h-[52px]' : 'px-2')}>
                        {/* Account Switcher */}
                        <AccountSwitcher isCollapsed={isCollapsed} />
                    </div>
                    <Separator />
                    {/* Sidebar */}
                    <Sidebar />
                    <div className="flex-1"></div>
                    {/* AI */}
                    Ask AI
                </div>

            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={defaultLayout[1]} minSize={15} maxSize={40}>
               <Tabs defaultValue='inbox'>
                    <div className='flex items-center px-4 py-2'>
                        <h1 className='text-x1 font-bold'>Inbox</h1>
                        <TabsList className='m1-auto'>
                            <TabsTrigger value='inbox'className='text-xinc-600 dark:text-zine-200'>
                                Inbox
                            </TabsTrigger>
                            <TabsTrigger value='done'className='text-xinc-600 dark:text-zine-200'>
                                Done
                            </TabsTrigger>
                        </TabsList>
                    </div>
                    <Separator />     
                    {/* Search Bar */}
                    Search Bar
                    <TabsContent value='inbox'>
                        <ThreadList/>
                    </TabsContent>
                    <TabsContent value='done'>
                        <ThreadList/>
                    </TabsContent>
               </Tabs>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
                <ThreadDisplay />
            </ResizablePanel>
        </ResizablePanelGroup>

     </TooltipProvider>
  )
}

export default Mail;