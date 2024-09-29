import { Shield, Wallet, Vote, DollarSign, GraduationCap, Users, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-green-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-16 text-white">Empowering the Community with Polygon Web3</h1>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column */}
          <div>
            <h2 className="text-3xl font-semibold mb-8 flex items-center text-white">
              <Shield className="mr-2" /> How We Leverage Polygon Web3
            </h2>
            <div className="space-y-6">
              <Card className="bg-black/50 border-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Wallet className="mr-2" /> Wallet Integration
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-white">
                  <p>Seamless wallet connection for community voting and participation. Our platform allows users to connect their wallets effortlessly, enabling them to participate in the community by voting on AI tools. This decentralized approach ensures that every voice is heard.</p>
                </CardContent>
              </Card>
              <Card className="bg-black/50 border-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Vote className="mr-2" /> Decentralized Governance
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-white">
                  <p>Empowering users to influence tool rankings through upvoting/downvoting. Users can influence the ranking of tools and websites by upvoting or downvoting submissions. This transparent voting mechanism fosters community trust and engagement.</p>
                </CardContent>
              </Card>
              <Card className="bg-black/50 border-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <DollarSign className="mr-2" /> Low Transaction Fees
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-white">
                  <p>Using Polygon ensures minimal costs for users when participating. Polygon's low transaction fees make it economically viable for users to participate in the governance process, ensuring that everyone can join without financial burden.</p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Right Column */}
          <div>
            <h2 className="text-3xl font-semibold mb-8 flex items-center text-white">
              <Users className="mr-2" /> Why This Project Matters
            </h2>
            <Card className="bg-black/50 border-green-500">
              <CardContent className="pt-6">
                <ul className="space-y-4 text-white">
                  <li className="flex items-start">
                    <Shield className="mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Community Safety</h3>
                      <p>Our platform helps keep users safe from harmful AI tools. In an era where AI technologies are rapidly evolving, our platform serves as a guardian, providing users with the tools they need to avoid harmful applications.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <GraduationCap className="mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Educational Value</h3>
                      <p>Providing resources for informed decision-making regarding AI usage. By offering insights and resources about AI tools, we empower users to make informed decisions, thus enhancing their understanding of technology.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Users className="mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Collaborative Environment</h3>
                      <p>Encouraging community involvement to improve AI safety collectively. Our platform encourages collaboration among users, allowing them to contribute to the safety and effectiveness of AI tools collectively.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <RefreshCw className="mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Daily Updates</h3>
                      <p>Regularly updated blocklists for enhanced protection. With our daily generated blocklists, users can stay informed and protected against potentially harmful AI websites and models.</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Call-to-Action Button */}
        <div className="mt-16 text-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            Join Us in Making AI Safer
          </Button>
        </div>
      </div>
    </div>
  )
}