import React from 'react'

const MainContent = ({ children }) => {
    return (
        <main className="flex-1 bg-robo-primary">
            <div className="max-w-none mx-0 h-screen relative bg-white">
                {children}
            </div>
        </main>
    )
}

export default MainContent